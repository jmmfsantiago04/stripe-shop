import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/db/products";
import { formatBRL } from "@/lib/format";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
      >
        ← Voltar ao catálogo
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-zinc-900">
            {formatBRL(product.priceCents)}
          </p>
          <p className="leading-relaxed text-zinc-600">
            {product.description}
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button type="button" size="lg" disabled>
              Adicionar ao carrinho
            </Button>
            <p className="text-sm text-zinc-500">Em breve · Must 2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
