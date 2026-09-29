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
        <p className="text-sm text-lumen-muted">Carregando carrinho…</p>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-lumen-ink">
          Carrinho
        </h1>

        <div className="mt-8 rounded-2xl border border-lumen-line bg-white px-6 py-12 text-center sm:px-10">
          <p className="text-xs font-medium tracking-wide text-lumen-muted uppercase">
            <span className="mr-1.5 inline-block size-1.5 rounded-full bg-lumen-amber align-middle" />
            Vazio
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-lumen-ink">
            Ainda sem peças na mesa
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-lumen-muted">
            Seu carrinho está vazio. Escolha periféricos e acessórios no
            catálogo pra montar o setup.
          </p>
          <Link
            href="/#produtos"
            className="mt-6 inline-flex items-center rounded-full bg-lumen-blue px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Ver produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-lumen-ink">
        Carrinho
      </h1>
      <p className="mt-1 text-sm text-lumen-muted">
        {itemCount} {itemCount === 1 ? "item" : "itens"}
      </p>

      <ul className="mt-8 divide-y divide-lumen-line border-y border-lumen-line">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 py-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-lumen-cream ring-1 ring-lumen-line">
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
                    className="font-medium text-lumen-ink hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-lumen-muted">
                    {formatBRL(item.priceCents)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium tabular-nums text-lumen-ink">
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
                    className="border-lumen-line text-lumen-ink hover:bg-lumen-cream"
                    onClick={() =>
                      setQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    −
                  </Button>
                  <span className="w-8 text-center text-sm tabular-nums text-lumen-ink">
                    {item.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label="Aumentar quantidade"
                    className="border-lumen-line text-lumen-ink hover:bg-lumen-cream"
                    onClick={() =>
                      setQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </div>

                <button
                  type="button"
                  className="text-sm text-lumen-muted underline hover:text-lumen-ink"
                  onClick={() => removeItem(item.productId)}
                >
                  Remover
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-lumen-line bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-medium tracking-wide text-lumen-muted uppercase">
            Subtotal
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-lumen-ink">
            {formatBRL(subtotalCents)}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <Button
            type="button"
            size="lg"
            disabled={loading}
            className="rounded-full bg-lumen-blue px-6 text-white hover:bg-lumen-blue/90"
            onClick={handleCheckout}
          >
            {loading ? "Redirecionando…" : "Finalizar compra"}
          </Button>
          {error ? (
            <p className="text-xs text-red-600">{error}</p>
          ) : (
            <p className="text-xs text-lumen-muted">
              Pagamento seguro via Stripe (modo teste)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
