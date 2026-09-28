import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { db } = await import("../lib/db");
  const { products } = await import("../lib/db/schema");
  const seedProducts = [

    {
      name: "Fone over-ear — Pulse Quiet",
      slug: "fone-over-ear-pulse-quiet",
      description:
        "Fone fechado com cancelamento ativo, almofadas macias e cabo destacável.",
      priceCents: 89900,
      imageUrl: "/products/fone-over-ear-pulse-quiet.png",
      category: "audio",
      active: true,
    },
    {
      name: "Earbuds — Clear Buds",
      slug: "earbuds-clear-buds",
      description:
        "True wireless com case compacto e até 24h de bateria com o estojo.",
      priceCents: 44900,
      imageUrl: "/products/earbuds-clear-buds.png",
      category: "audio",
      active: true,
    },
    {
      name: "Soundbar compacta — Desk Wave",
      slug: "soundbar-compacta-desk-wave",
      description:
        "Barra USB pra monitor, graves limpos e controle de volume na lateral.",
      priceCents: 39900,
      imageUrl: "/products/soundbar-compacta-desk-wave.png",
      category: "audio",
      active: true,
    },
    {
      name: "Microfone USB — Voice Beam",
      slug: "microfone-usb-voice-beam",
      description:
        "Microfone cardioide pra calls e streams. Plug and play no USB-C.",
      priceCents: 52900,
      imageUrl: "/products/microfone-usb-voice-beam.png",
      category: "audio",
      active: true,
    },
    {
      name: "Headset gamer leve — Soft Com",
      slug: "headset-gamer-leve-soft-com",
      description:
        "Headset leve com mic flexível e som estéreo. Confortável o dia todo.",
      priceCents: 34900,
      imageUrl: "/products/headset-gamer-leve-soft-com.png",
      category: "audio",
      active: true,
    },
    
    {
      name: "Teclado mecânico — Keystone 75",
      slug: "teclado-mecanico-keystone-75",
      description:
        "Layout 75%, switches táteis e cabo USB-C destacável. Perfil baixo.",
      priceCents: 64900,
      imageUrl: "/products/teclado-mecanico-keystone-75.png",
      category: "perifericos",
      active: true,
    },
    {
      name: "Mouse ergonômico — Orbit Soft",
      slug: "mouse-ergonomico-orbit-soft",
      description:
        "Mouse vertical leve, sensor preciso e botões silenciosos.",
      priceCents: 27900,
      imageUrl: "/products/mouse-ergonomico-orbit-soft.png",
      category: "perifericos",
      active: true,
    },
    {
      name: "Webcam 1080p — Frame Clear",
      slug: "webcam-1080p-frame-clear",
      description:
        "Full HD com autofoco e microfone embutido. Clip no monitor.",
      priceCents: 32900,
      imageUrl: "/products/webcam-1080p-frame-clear.png",
      category: "perifericos",
      active: true,
    },
    {
      name: "Trackpad sem fio — Glass Slide",
      slug: "trackpad-sem-fio-glass-slide",
      description:
        "Superfície de vidro, gestos multi-toque e bateria recarregável.",
      priceCents: 41900,
      imageUrl: "/products/trackpad-sem-fio-glass-slide.png",
      category: "perifericos",
      active: true,
    },
    {
      name: "Hub USB-C 7-em-1 — Port Dock",
      slug: "hub-usb-c-7-em-1-port-dock",
      description:
        "HDMI 4K, USB-A, leitor SD e PD. Um cabo do notebook pra tudo.",
      priceCents: 29900,
      imageUrl: "/products/hub-usb-c-7-em-1-port-dock.png",
      category: "perifericos",
      active: true,
    },
    
    {
      name: "Barra de LED pro monitor — Edge Glow",
      slug: "barra-led-monitor-edge-glow",
      description:
        "Luz frontal sem reflexo na tela. Temperatura e brilho ajustáveis.",
      priceCents: 24900,
      imageUrl: "/products/barra-led-monitor-edge-glow.png",
      category: "iluminacao",
      active: true,
    },
    {
      name: "Luminária de mesa — Arc Warm",
      slug: "luminaria-mesa-arc-warm",
      description:
        "Braço articulado, luz quente e base estável. Perfeita pro side desk.",
      priceCents: 21900,
      imageUrl: "/products/luminaria-mesa-arc-warm.png",
      category: "iluminacao",
      active: true,
    },
    {
      name: "Ring light compacto — Soft Ring",
      slug: "ring-light-compacto-soft-ring",
      description:
        "Anel de 10\" com tripé curto. Calls e selfies com luz uniforme.",
      priceCents: 18900,
      imageUrl: "/products/ring-light-compacto-soft-ring.png",
      category: "iluminacao",
      active: true,
    },
    {
      name: "Fita LED smart — Desk Strip",
      slug: "fita-led-smart-desk-strip",
      description:
        "2 metros RGB atrás do setup. App e modos estáticos.",
      priceCents: 12900,
      imageUrl: "/products/fita-led-smart-desk-strip.png",
      category: "iluminacao",
      active: true,
    },
    {
      name: "Lâmpada de leitura — Clip Focus",
      slug: "lampada-leitura-clip-focus",
      description:
        "Clip no monitor ou prateleira. Feixe direcionado sem ofuscar.",
      priceCents: 9900,
      imageUrl: "/products/lampada-leitura-clip-focus.png",
      category: "iluminacao",
      active: true,
    },
    
    {
      name: "Mousepad XL — Soft Grid",
      slug: "mousepad-xl-soft-grid",
      description:
        "90×40 cm, base antiderrapante e superfície costurada.",
      priceCents: 8900,
      imageUrl: "/products/mousepad-xl-soft-grid.png",
      category: "acessorios",
      active: true,
    },
    {
      name: "Suporte notebook — Lift Stand",
      slug: "suporte-notebook-lift-stand",
      description:
        "Suporte de alumínio com altura ajustável. Melhora a postura.",
      priceCents: 18900,
      imageUrl: "/products/suporte-notebook-lift-stand.png",
      category: "acessorios",
      active: true,
    },
    {
      name: "Cabo USB-C trançado — 2m",
      slug: "cabo-usb-c-trancado-2m",
      description:
        "Cabo reforçado 100W, 2 metros. Carrega e sincroniza.",
      priceCents: 7900,
      imageUrl: "/products/cabo-usb-c-trancado-2m.png",
      category: "acessorios",
      active: true,
    },
    {
      name: "Organizador de cabos — Tray Hide",
      slug: "organizador-cabos-tray-hide",
      description:
        "Bandeja sob a mesa pra esconder fontes e hubs. Visual limpo.",
      priceCents: 11900,
      imageUrl: "/products/organizador-cabos-tray-hide.png",
      category: "acessorios",
      active: true,
    },
    {
      name: "Carregador GaN 65W — Power Cube",
      slug: "carregador-gan-65w-power-cube",
      description:
        "Carregador compacto 65W com 2 portas USB-C. Notebook e fone juntos.",
      priceCents: 21900,
      imageUrl: "/products/carregador-gan-65w-power-cube.png",
      category: "acessorios",
      active: true,
    },
  ];

  console.log("Populando produtos Lumen Desk…");

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
