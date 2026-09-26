"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartLink() {
  const { itemCount, ready } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-zinc-600 transition-colors hover:text-zinc-900"
    >
      Carrinho
      {ready && itemCount > 0 ? (
        <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1.5 py-0.5 text-xs font-medium text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}
