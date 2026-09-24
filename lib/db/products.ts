import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { products } from "./schema";

export type Product = typeof products.$inferSelect;

export async function getActiveProducts() {
  return db.select().from(products).where(eq(products.active, true));
}

export async function getProductBySlug(slug: string) {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.active, true)))
    .limit(1);

  return rows[0] ?? null;
}
