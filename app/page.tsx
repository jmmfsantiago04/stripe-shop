import Image from "next/image";
import { CatalogFilters } from "@/components/catalog-filters";
import { ProductCard } from "@/components/product-card";
import {
  filterProducts,
  parseCatalogParams,
} from "@/lib/catalog";
import { getActiveProducts } from "@/lib/db/products";

type HomeProps = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const { category, q } = parseCatalogParams(params);
  const all = await getActiveProducts();
  const items = filterProducts(all, { category, q });

  return (
    <div>
      <section className="border-b border-lumen-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-20">
          <Image
            src="/lumen-desk-lockup.png"
            alt="Lumen Desk"
            width={1034}
            height={199}
            className="h-auto w-full max-w-md object-contain sm:max-w-lg"
            priority
          />
          <p className="mt-8 text-sm text-lumen-muted">
            <span className="text-lumen-amber">●</span> Demo de portfolio
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-lumen-ink sm:text-5xl">
            Mesa limpa.
            <br />
            Setup afiado.
          </h1>
          <div className="mt-4 h-px w-16 bg-lumen-amber" />
          <p className="mt-5 max-w-md text-base leading-relaxed text-lumen-muted">
            Periféricos e acessórios para desk setup. Catálogo no Neon, carrinho
            no navegador, pagamento com Stripe Checkout em modo teste.
          </p>
          <a
            href="#produtos"
            className="mt-8 inline-flex items-center rounded-full bg-lumen-blue px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Ver produtos
          </a>
        </div>
      </section>

      <div id="produtos" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-lumen-ink">
            Produtos
          </h2>
          <p className="mt-1 text-sm text-lumen-muted">
            {items.length} {items.length === 1 ? "item" : "itens"}
            {category || q ? ` (filtrado de ${all.length})` : ""}
          </p>
        </div>

        <CatalogFilters activeCategory={category} initialQ={q} />

        {items.length === 0 ? (
          <div className="rounded-2xl border border-lumen-line bg-white px-6 py-12 text-center sm:px-10">
            <p className="text-xs font-medium tracking-wide text-lumen-muted uppercase">
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-lumen-amber align-middle" />
              Catálogo
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-lumen-ink">
              Nada por aqui
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-lumen-muted">
              Nenhum produto combina com essa categoria ou busca. Limpe os filtros
              pra ver o catálogo completo.
            </p>
            <a
              href="/#produtos"
              className="mt-6 inline-flex items-center rounded-full bg-lumen-blue px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Limpar filtros
            </a>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
