import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Checkout cancelado
      </h1>
      <p className="mt-3 text-zinc-600">
        Você saiu do pagamento. Seu carrinho continua salvo neste navegador.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/cart"
          className="text-sm font-medium text-zinc-900 underline"
        >
          Voltar ao carrinho
        </Link>
        <Link href="/" className="text-sm text-zinc-600 underline">
          Catálogo
        </Link>
      </div>
    </div>
  );
}
