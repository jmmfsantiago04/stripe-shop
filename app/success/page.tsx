import Link from "next/link";
import { ClearCartOnSuccess } from "@/components/clear-cart-on-success";
import { getOrderBySessionId } from "@/lib/db/orders";
import { formatBRL } from "@/lib/format";
import { stripe } from "@/lib/stripe";

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

async function waitForOrder(sessionId: string, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    const order = await getOrderBySessionId(sessionId);
    if (order) return order;
    await new Promise((r) => setTimeout(r, 800));
  }
  return null;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Sessão inválida
        </h1>
        <p className="mt-3 text-zinc-600">
          Não encontramos um pagamento para mostrar.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-medium text-zinc-900 underline"
        >
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const order = await waitForOrder(sessionId);

  if (order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <ClearCartOnSuccess />
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Pedido confirmado
          </h1>
          <p className="mt-3 text-zinc-600">
            Pagamento recebido. Pedido salvo no banco (demo).
          </p>
          {order.customerEmail ? (
            <p className="mt-2 text-sm text-zinc-500">
              Recibo: {order.customerEmail}
            </p>
          ) : null}
        </div>

        <ul className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-3 text-sm"
            >
              <span className="text-zinc-900">
                {item.name} × {item.quantity}
              </span>
              <span className="tabular-nums text-zinc-700">
                {formatBRL(item.unitAmountCents * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-lg font-semibold text-zinc-900">
          Total {formatBRL(order.amountTotalCents)}
        </p>

        <p className="mt-2 text-center text-xs text-zinc-400">
          ID: {order.id.slice(0, 8)}…
        </p>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-900 underline"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  let amountCents: number | null = null;
  let email: string | null = null;
  let paid = false;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paid =
      session.payment_status === "paid" || session.status === "complete";
    amountCents =
      typeof session.amount_total === "number" ? session.amount_total : null;
    email = session.customer_details?.email ?? session.customer_email ?? null;
  } catch {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Não foi possível confirmar
        </h1>
        <p className="mt-3 text-zinc-600">
          Tente de novo pelo carrinho ou confira o e-mail do Stripe (modo
          teste).
        </p>
        <Link
          href="/cart"
          className="mt-8 inline-block text-sm font-medium text-zinc-900 underline"
        >
          Ir ao carrinho
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      {paid ? <ClearCartOnSuccess /> : null}
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        {paid ? "Pagamento confirmado" : "Pagamento em processamento"}
      </h1>
      <p className="mt-3 text-zinc-600">
        O pedido ainda está sendo confirmado. Atualize a página em alguns segundos.
      </p>
      {paid && amountCents != null ? (
        <p className="mt-6 text-lg font-semibold text-zinc-900">
          Total {formatBRL(amountCents)}
        </p>
      ) : null}
      {email ? (
        <p className="mt-2 text-sm text-zinc-500">Recibo: {email}</p>
      ) : null}
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium text-zinc-900 underline"
      >
        Continuar comprando
      </Link>
    </div>
  );
}