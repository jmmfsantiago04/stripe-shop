import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { db } = await import("../lib/db");
  const { products } = await import("../lib/db/schema");

  const seedProducts = [
    {
      name: "Print line art — Noite na cidade",
      slug: "print-line-art-noite-cidade",
      description: "Print A3 fosco. Traço preto mínimo em papel quente.",
      priceCents: 4900,
      imageUrl:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      active: true,
    },
    {
      name: "Cartela de adesivos — Ícones",
      slug: "cartela-adesivos-icones",
      description:
        "12 adesivos de vinil. À prova d'água, ideais pro notebook.",
      priceCents: 2490,
      imageUrl:
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      active: true,
    },
    {
      name: "Ecobag soft",
      slug: "ecobag-soft",
      description: "Ecobag de algodão cru. Estampa frontal em uma cor.",
      priceCents: 5990,
      imageUrl:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
      active: true,
    },
    {
      name: "Pin esmaltado — Estrela",
      slug: "pin-esmaltado-estrela",
      description: "Pin de esmalte duro com trava de borracha.",
      priceCents: 1990,
      imageUrl:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
      active: true,
    },
    {
      name: "Caderno — Pontilhado",
      slug: "caderno-pontilhado",
      description: "Caderno A5 pontilhado, 120 páginas, capa soft.",
      priceCents: 3490,
      imageUrl:
        "https://images.unsplash.com/photo-1531346878377-a5be20836c33?w=800&q=80",
      active: true,
    },
    {
      name: "Pôster — Degradê",
      slug: "poster-degrade",
      description: "Pôster 50×70 cm. Papel grosso, enviado enrolado.",
      priceCents: 7900,
      imageUrl:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
      active: true,
    },
    {
      name: "Caneca — Do dia a dia",
      slug: "caneca-dia-a-dia",
      description: "Caneca de cerâmica, 350 ml. Vai na lava-louças.",
      priceCents: 4490,
      imageUrl:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
      active: true,
    },
    {
      name: "Boné — Soft crown",
      slug: "bone-soft-crown",
      description: "Boné de algodão sem estrutura. Ajuste atrás.",
      priceCents: 6990,
      imageUrl:
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
      active: true,
    },
  ];

  console.log("Populando produtos…");

  await db.delete(products);
  await db.insert(products).values(seedProducts);

  console.log(`Inseridos ${seedProducts.length} produtos.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
