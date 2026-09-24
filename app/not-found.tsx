import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Produto não encontrado
      </h1>
      <p className="mt-2 text-zinc-600">
        Esse item não existe ou não está ativo.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-zinc-900 underline"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
