"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { formatBRL } from "@/lib/format";

export default function CartPage() {
  const { items, ready, itemCount, subtotalCents, setQuantity, removeItem } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Falha no checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no checkout");
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm text-zinc-500">Carregando carrinho…</p>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Carrinho
        </h1>
        <p className="mt-4 text-zinc-600">Seu carrinho está vazio.</p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-zinc-900 underline"
        >
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Carrinho
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        {itemCount} {itemCount === 1 ? "item" : "itens"}
      </p>

      <ul className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 py-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-zinc-200">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-600">
                    {formatBRL(item.priceCents)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium text-zinc-900">
                  {formatBRL(item.priceCents * item.quantity)}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label="Diminuir quantidade"
                    onClick={() =>
                      setQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    −
                  </Button>
                  <span className="w-8 text-center text-sm tabular-nums">
                    {item.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label="Aumentar quantidade"
                    onClick={() =>
                      setQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </div>

                <button
                  type="button"
                  className="text-sm text-zinc-500 underline hover:text-zinc-900"
                  onClick={() => removeItem(item.productId)}
                >
                  Remover
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-semibold text-zinc-900">
          Subtotal{" "}
          <span className="tabular-nums">{formatBRL(subtotalCents)}</span>
        </p>

        <div className="flex flex-col gap-2 sm:items-end">
          <Button
            type="button"
            size="lg"
            disabled={loading}
            onClick={handleCheckout}
          >
            {loading ? "Redirecionando…" : "Finalizar compra"}
          </Button>
          {error ? (
            <p className="text-xs text-red-600">{error}</p>
          ) : (
            <p className="text-xs text-zinc-500">
              Pagamento seguro via Stripe (modo teste)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
