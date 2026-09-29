import { asc, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "./index";
import { orderItems, orders, products } from "./schema";
import type { ProductCategoryId } from "@/lib/categories";

export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export type OrderWithItems = Order & { items: OrderItem[] };

export const ORDER_SORTS = [
  "date_desc",
  "date_asc",
  "total_desc",
  "total_asc",
] as const;

export type OrderSort = (typeof ORDER_SORTS)[number];

export function parseOrderSort(value: string | undefined): OrderSort {
  if (value && (ORDER_SORTS as readonly string[]).includes(value)) {
    return value as OrderSort;
  }
  return "date_desc";
}

export type ListOrdersOptions = {
  limit?: number;
  sort?: OrderSort;
  q?: string;
  category?: ProductCategoryId;
};

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

export async function getOrderById(
  id: string,
): Promise<OrderWithItems | null> {
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  const order = rows[0];
  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return { ...order, items };
}

export async function listOrders(
  options: ListOrdersOptions = {},
): Promise<OrderWithItems[]> {
  const limit = options.limit ?? 50;
  const sort = options.sort ?? "date_desc";
  const q = options.q?.trim() || undefined;
  const category = options.category;

  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const orderByClause =
    sort === "date_asc"
      ? asc(orders.createdAt)
      : sort === "total_desc"
        ? desc(orders.amountTotalCents)
        : sort === "total_asc"
          ? asc(orders.amountTotalCents)
          : desc(orders.createdAt);

  const emailClause =
    q && q.length > 0
      ? ilike(orders.customerEmail, `%${q}%`)
      : undefined;

  const orderRows = emailClause
    ? await db
        .select()
        .from(orders)
        .where(emailClause)
        .orderBy(orderByClause)
        .limit(safeLimit)
    : await db
        .select()
        .from(orders)
        .orderBy(orderByClause)
        .limit(safeLimit);

  if (orderRows.length === 0) return [];

  const orderIds = orderRows.map((o) => o.id);

  const itemRows = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds));

  const itemsByOrderId = new Map<string, OrderItem[]>();
  for (const item of itemRows) {
    const list = itemsByOrderId.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrderId.set(item.orderId, list);
  }

  let result: OrderWithItems[] = orderRows.map((order) => ({
    ...order,
    items: itemsByOrderId.get(order.id) ?? [],
  }));

  if (category) {
    const productIds = [
      ...new Set(
        result
          .flatMap((o) => o.items)
          .map((i) => i.productId)
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    if (productIds.length === 0) {
      return [];
    }

    const productRows = await db
      .select({
        id: products.id,
        category: products.category,
      })
      .from(products)
      .where(inArray(products.id, productIds));

    const categoryByProductId = new Map(
      productRows.map((p) => [p.id, p.category]),
    );

    result = result.filter((order) =>
      order.items.some((item) => {
        if (!item.productId) return false;
        return categoryByProductId.get(item.productId) === category;
      }),
    );
  }

  return result;
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
