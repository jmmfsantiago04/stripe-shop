import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createOrderFromCheckout } from "@/lib/db/orders";
import { getActiveProductsByIds } from "@/lib/db/products";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

function parseItemsMetadata(raw: string | undefined) {
  if (!raw) return [] as { productId: string; quantity: number }[];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const productId = (row as { productId?: unknown }).productId;
        const quantity = Number((row as { quantity?: unknown }).quantity);
        if (typeof productId !== "string") return null;
        if (!Number.isInteger(quantity) || quantity < 1) return null;
        return { productId, quantity };
      })
      .filter((row): row is { productId: string; quantity: number } =>
        Boolean(row),
      );
  } catch {
    return [];
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metaItems = parseItemsMetadata(session.metadata?.items);
  const ids = [...new Set(metaItems.map((i) => i.productId))];
  const products = await getActiveProductsByIds(ids);
  const byId = new Map(products.map((p) => [p.id, p]));

  const lineItems = metaItems
    .map((item) => {
      const product = byId.get(item.productId);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        unitAmountCents: product.priceCents,
        quantity: item.quantity,
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  await createOrderFromCheckout({
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId,
    customerEmail:
      session.customer_details?.email ?? session.customer_email ?? null,
    amountTotalCents: session.amount_total ?? 0,
    currency: session.currency ?? "brl",
    items: lineItems,
  });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET não configurada" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("webhook signature", err);
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
    }
  } catch (err) {
    console.error("webhook handler", err);
    return NextResponse.json({ error: "Falha ao processar" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
