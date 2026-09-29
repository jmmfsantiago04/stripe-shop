"use client";

import { useRouter } from "next/navigation";
import {
  PRODUCT_CATEGORIES,
  type ProductCategoryId,
} from "@/lib/categories";
import type { OrderSort } from "@/lib/db/orders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoryFilterProps = {
  sort: OrderSort;
  category?: ProductCategoryId;
  q?: string;
};

function adminOrdersHref(opts: {
  sort?: OrderSort;
  category?: ProductCategoryId;
  q?: string;
}) {
  const params = new URLSearchParams();
  if (opts.sort && opts.sort !== "date_desc") {
    params.set("sort", opts.sort);
  }
  if (opts.category) {
    params.set("category", opts.category);
  }
  if (opts.q && opts.q.trim()) {
    params.set("q", opts.q.trim());
  }
  const qs = params.toString();
  return qs ? `/admin/orders?${qs}` : "/admin/orders";
}

export function CategoryFilter({
  sort,
  category,
  q,
}: CategoryFilterProps) {
  const router = useRouter();
  const value = category ?? "all";
  const displayLabel = category
    ? (PRODUCT_CATEGORIES.find((c) => c.id === category)?.label ?? category)
    : "Todos";

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-lumen-muted">
        Categoria
      </span>
      <Select
        value={value}
        onValueChange={(next) => {
          const nextCategory =
            !next || next === "all"
              ? undefined
              : (next as ProductCategoryId);
          router.push(
            adminOrdersHref({ sort, category: nextCategory, q }),
          );
        }}
      >
        <SelectTrigger
          size="sm"
          className="h-8 w-44 rounded-full border-lumen-line bg-white text-lumen-ink focus-visible:border-lumen-blue"
        >
          <SelectValue placeholder="Todos">{displayLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent
          align="start"
          className="rounded-xl border border-lumen-line bg-white"
        >
          <SelectItem value="all">Todos</SelectItem>
          {PRODUCT_CATEGORIES.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
