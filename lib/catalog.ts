import {
    isProductCategoryId,
    type ProductCategoryId,
  } from "@/lib/categories";
  import type { Product } from "@/lib/db/products";
  
  export type CatalogParams = {
    category?: string;
    q?: string;
  };
  
  export function parseCatalogParams(params: CatalogParams): {
    category: ProductCategoryId | null;
    q: string;
  } {
    const category =
      params.category && isProductCategoryId(params.category)
        ? params.category
        : null;
    const q = (params.q ?? "").trim();
    return { category, q };
  }
  
  export function filterProducts(
    products: Product[],
    opts: { category: ProductCategoryId | null; q: string },
  ): Product[] {
    let list = products;
  
    if (opts.category) {
      list = list.filter((p) => p.category === opts.category);
    }
  
    if (opts.q) {
      const needle = opts.q.toLowerCase();
      list = list.filter((p) => {
        const hay = `${p.name} ${p.description}`.toLowerCase();
        return hay.includes(needle);
      });
    }
  
    return list;
  }
  
  export function catalogHref(opts: {
    category?: ProductCategoryId | null;
    q?: string;
  }): string {
    const sp = new URLSearchParams();
    if (opts.category) sp.set("category", opts.category);
    const q = (opts.q ?? "").trim();
    if (q) sp.set("q", q);
    const s = sp.toString();
    return s ? `/?${s}` : "/#produtos";
  }