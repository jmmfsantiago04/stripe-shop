import Link from "next/link";
import { ClearCartOnSuccess } from "@/components/clear-cart-on-success";
import { formatBRL } from "@/lib/format";
import { stripe } from "@/lib/stripe";

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

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

  let paid = false;
  let amountCents: number | null = null;
  let email: string | null = null;

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
        {paid
          ? "Obrigado! Seu pedido de demonstração foi registrado no Stripe (modo teste)."
          : "Recebemos o retorno do Stripe, mas o status ainda não está como pago."}
      </p>

      {paid && amountCents != null ? (
        <p className="mt-6 text-lg font-semibold text-zinc-900">
          Total {formatBRL(amountCents)}
        </p>
      ) : null}

      {email ? (
        <p className="mt-2 text-sm text-zinc-500">Recibo: {email}</p>
      ) : null}

      <p className="mt-6 text-xs text-zinc-400">
        Pedido no banco (Order) chega no Must 3, com webhooks.
      </p>

      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium text-zinc-900 underline"
      >
        Continuar comprando
      </Link>
    </div>
  );
}
