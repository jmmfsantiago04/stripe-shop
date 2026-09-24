import { ProductCard } from "@/components/product-card";
import { getActiveProducts } from "@/lib/db/products";

export default async function HomePage() {
  const items = await getActiveProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Catálogo
        </h1>
        <p className="mt-2 text-zinc-600">
          {items.length} {items.length === 1 ? "produto" : "produtos"}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-zinc-600">
          Nenhum produto ativo. Rode{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm">
            npm run db:seed
          </code>
          .
        </p>
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
  );
}
