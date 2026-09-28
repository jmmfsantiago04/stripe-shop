"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PRODUCT_CATEGORIES, type ProductCategoryId } from "@/lib/categories";
import { catalogHref } from "@/lib/catalog";

type Props = {
  activeCategory: ProductCategoryId | null;
  initialQ: string;
};

export function CatalogFilters({ activeCategory, initialQ }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    router.push(
      catalogHref({ category: activeCategory, q }),
    );
  }

  const chipBase =
    "rounded-full border px-3 py-1.5 text-sm transition-colors";
  const chipIdle =
    "border-lumen-line bg-white text-lumen-muted hover:border-lumen-ink/30 hover:text-lumen-ink";
  const chipActive =
    "border-lumen-ink bg-lumen-ink text-lumen-cream";

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Link
          href={catalogHref({ category: null, q: initialQ })}
          className={`${chipBase} ${
            activeCategory === null ? chipActive : chipIdle
          }`}
        >
          Todos
        </Link>
        {PRODUCT_CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={catalogHref({ category: c.id, q: initialQ })}
            className={`${chipBase} ${
              activeCategory === c.id ? chipActive : chipIdle
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <form
        onSubmit={onSearch}
        className="mx-auto flex w-full max-w-md gap-2"
      >
        <input
          type="search"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar produtos…"
          className="min-w-0 flex-1 rounded-full border border-lumen-line bg-white px-4 py-2 text-sm text-lumen-ink placeholder:text-lumen-muted outline-none focus:border-lumen-blue"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-lumen-blue px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
