import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { getCategoryLabel } from "@/lib/categories";
import {
  getActiveProducts,
  getProductBySlug,
} from "@/lib/db/products";
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

  const all = await getActiveProducts();
  const related = all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/#produtos"
        className="text-sm text-lumen-muted transition-colors hover:text-lumen-ink"
      >
        ← Voltar ao catálogo
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-lumen-cream ring-1 ring-lumen-line">
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
          <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-lumen-muted uppercase">
            <span
              className="inline-block size-1.5 rounded-full bg-lumen-amber"
              aria-hidden
            />
            {getCategoryLabel(product.category)}
          </p>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-lumen-ink sm:text-4xl">
            {product.name}
          </h1>

          <p className="font-display text-2xl font-semibold tabular-nums text-lumen-ink">
            {formatBRL(product.priceCents)}
          </p>

          <div className="h-px w-12 bg-lumen-amber" />

          <p className="leading-relaxed text-lumen-muted">
            {product.description}
          </p>

          <div className="mt-4">
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              priceCents={product.priceCents}
              imageUrl={product.imageUrl}
            />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-lumen-line pt-12">
          <p className="text-xs font-medium tracking-wide text-lumen-muted uppercase">
            <span className="mr-1.5 inline-block size-1.5 rounded-full bg-lumen-amber align-middle" />
            Na mesma categoria
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-lumen-ink">
            Continua o setup
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}