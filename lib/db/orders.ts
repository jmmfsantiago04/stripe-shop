import { eq } from "drizzle-orm";
import { db } from "./index";
import { orderItems, orders } from "./schema";

export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export type OrderWithItems = Order & { items: OrderItem[] };

export async function getOrderBySessionId(
  stripeCheckoutSessionId: string,
): Promise<OrderWithItems | null> {
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.stripeCheckoutSessionId, stripeCheckoutSessionId))
    .limit(1);

  const order = rows[0];
  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return { ...order, items };
}

type CreateOrderInput = {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  customerEmail: string | null;
  amountTotalCents: number;
  currency: string;
  items: {
    productId: string | null;
    name: string;
    unitAmountCents: number;
    quantity: number;
  }[];
};

export async function createOrderFromCheckout(
  input: CreateOrderInput,
): Promise<OrderWithItems> {
  const existing = await getOrderBySessionId(input.stripeCheckoutSessionId);
  if (existing) return existing;

  const [order] = await db
    .insert(orders)
    .values({
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
      stripePaymentIntentId: input.stripePaymentIntentId,
      status: "paid",
      customerEmail: input.customerEmail,
      amountTotalCents: input.amountTotalCents,
      currency: input.currency,
    })
    .returning();

  const items =
    input.items.length === 0
      ? []
      : await db
          .insert(orderItems)
          .values(
            input.items.map((item) => ({
              orderId: order.id,
              productId: item.productId,
              name: item.name,
              unitAmountCents: item.unitAmountCents,
              quantity: item.quantity,
            })),
          )
          .returning();

  return { ...order, items };
}