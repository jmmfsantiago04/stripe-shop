import { NextResponse } from "next/server";
import { getActiveProductsByIds } from "@/lib/db/products";
import { stripe } from "@/lib/stripe";

type CheckoutBodyItem = {
  productId: string;
  quantity: number;
};

type CheckoutBody = {
  items?: CheckoutBodyItem[];
};

export async function POST(request: Request) {
  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const cleaned: { productId: string; quantity: number }[] = [];

  for (const item of rawItems) {
    if (!item || typeof item.productId !== "string") {
      return NextResponse.json({ error: "Item inválido" }, { status: 400 });
    }
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: "Quantidade inválida" },
        { status: 400 },
      );
    }
    cleaned.push({ productId: item.productId, quantity });
  }

  const ids = [...new Set(cleaned.map((i) => i.productId))];
  const products = await getActiveProductsByIds(ids);

  if (products.length !== ids.length) {
    return NextResponse.json(
      { error: "Produto inválido ou inativo" },
      { status: 400 },
    );
  }

  const byId = new Map(products.map((p) => [p.id, p]));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (!appUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_APP_URL não configurada" },
      { status: 500 },
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY não configurada" },
      { status: 500 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cleaned.map((item) => {
        const product = byId.get(item.productId)!;
        return {
          quantity: item.quantity,
          price_data: {
            currency: "brl",
            unit_amount: product.priceCents,
            product_data: {
              name: product.name,
              description: product.description.slice(0, 200),
              images: product.imageUrl ? [product.imageUrl] : undefined,
            },
          },
        };
      }),
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      metadata: {
        source: "stripe-shop",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe não retornou URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("checkout error", err);
    return NextResponse.json(
      { error: "Falha ao criar sessão de checkout" },
      { status: 500 },
    );
  }
}
