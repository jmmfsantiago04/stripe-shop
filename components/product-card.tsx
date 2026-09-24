import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/lib/db/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <CardHeader className="gap-1">
          <CardTitle className="line-clamp-2 group-hover:underline">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base font-semibold text-zinc-900">
            {formatBRL(product.priceCents)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
