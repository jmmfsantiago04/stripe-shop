"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";

type Props = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
};

export function AddToCartButton(props: Props) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button
        type="button"
        size="lg"
        onClick={() => {
          addItem(props, 1);
          setJustAdded(true);
          window.setTimeout(() => setJustAdded(false), 1500);
        }}
      >
        {justAdded ? "Adicionado!" : "Adicionar ao carrinho"}
      </Button>
      <p className="text-sm text-zinc-500">
        <a href="/cart" className="underline hover:text-zinc-900">
          Ver carrinho
        </a>
      </p>
    </div>
  );
}