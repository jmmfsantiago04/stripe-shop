"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartLink() {
  const { itemCount, ready } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-lumen-muted transition-colors hover:text-lumen-blue"
    >
      Carrinho
      {ready && itemCount > 0 ? (
        <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-lumen-blue px-1.5 py-0.5 text-xs font-medium text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}
