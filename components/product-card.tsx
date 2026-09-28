import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategoryLabel } from "@/lib/categories";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/lib/db/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <Card
        className={[
          "h-full gap-0 overflow-hidden rounded-2xl border border-lumen-line",
          "bg-white py-0 shadow-none ring-0",
          "transition-shadow duration-300",
          "group-hover:shadow-[0_8px_24px_rgba(26,21,16,0.08)]",
        ].join(" ")}
      >

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-lumen-cream/40">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <CardHeader className="gap-2 px-4 pt-4 pb-1">
          <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-lumen-muted uppercase">
            <span
              className="inline-block size-1.5 rounded-full bg-lumen-amber"
              aria-hidden
            />
            {getCategoryLabel(product.category)}
          </p>

          <CardTitle
            className={[
              "font-display text-lg font-semibold leading-snug text-lumen-ink",
              "line-clamp-2 transition-colors",
              "group-hover:text-lumen-blue",
            ].join(" ")}
          >
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pt-1 pb-4">
          <p className="text-base font-semibold tabular-nums text-lumen-ink">
            {formatBRL(product.priceCents)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}