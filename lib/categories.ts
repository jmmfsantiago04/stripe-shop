export const PRODUCT_CATEGORIES = [
    { id: "audio", label: "Áudio" },
    { id: "perifericos", label: "Periféricos" },
    { id: "iluminacao", label: "Iluminação" },
    { id: "acessorios", label: "Acessórios" },
  ] as const;
  
  export type ProductCategoryId =
    (typeof PRODUCT_CATEGORIES)[number]["id"];
  
  export function isProductCategoryId(
    value: string,
  ): value is ProductCategoryId {
    return PRODUCT_CATEGORIES.some((c) => c.id === value);
  }
  
  export function getCategoryLabel(id: string): string {
    return (
      PRODUCT_CATEGORIES.find((c) => c.id === id)?.label ?? id
    );
  }