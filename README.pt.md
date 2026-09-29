English: [README.md](./README.md)

# Lumen Desk

Loja demo Stripe de eletrônicos e desk setup — catálogo, carrinho e checkout com webhooks para pedidos.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Drizzle ORM** + **Neon Postgres**
- **Stripe Checkout** + webhooks

## Features

- Catálogo com busca e filtros
- Carrinho persistido em `localStorage`
- Checkout via Stripe Checkout
- Webhook `checkout.session.completed` → grava pedidos no banco
- Admin enxuto com login e filtros de pedidos

## Setup local

```bash
git clone <repo-url>
cd stripe-shop
npm i
cp .env.example .env.local
```

Preencha as variáveis em `.env.local` (veja a tabela abaixo), depois:

```bash
npm run db:push
npm run db:seed
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

> **Nota (Windows):** os scripts `dev` e `build` usam `--webpack`. Em alguns setups Windows, o Application Control / SWC pode falhar sem essa flag.

## Variáveis de ambiente

| Variável | Propósito |
|---|---|
| `DATABASE_URL` | Connection string Neon (runtime / pooled) |
| `DATABASE_URL_UNPOOLED` | Connection string Neon sem pool (Drizzle Kit / migrations) |
| `STRIPE_SECRET_KEY` | Chave secreta da API Stripe (`sk_test_…` / `sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | Segredo do endpoint de webhook (`whsec_…`) |
| `NEXT_PUBLIC_APP_URL` | URL pública da app (ex.: `http://localhost:3000`) — usada nos redirects do Checkout |
| `ADMIN_PASSWORD` | Senha do painel admin |
| `ADMIN_SESSION_SECRET` | Segredo para assinar o cookie de sessão admin |

Opcional: `NEXT_PUBLIC_SITE_URL` (metadataBase / OG; fallback `http://localhost:3000`).

**Não** coloque secrets reais no repositório — use `.env.local` (já no `.gitignore`).

## Webhooks locais (Stripe CLI)

Em outro terminal:

```bash
stripe listen --events checkout.session.completed --forward-to localhost:3000/api/webhooks/stripe
```

Copie o `whsec_…` gerado pelo CLI para `STRIPE_WEBHOOK_SECRET` em `.env.local` e reinicie o `npm run dev` se necessário.

## Pagamento de teste

Cartão Stripe de teste:

- Número: `4242 4242 4242 4242`
- Validade: qualquer data futura
- CVC: qualquer 3 dígitos

Use o modo **test** no Dashboard Stripe (`sk_test_…`).

## Admin

- Login: `/admin/login` (senha = `ADMIN_PASSWORD`)
- Pedidos: `/admin/orders`

## Deploy

1. Faça deploy na **Vercel** (ou similar).
2. Configure as **mesmas** variáveis de ambiente no painel do host.
3. No Stripe Dashboard, crie um webhook apontando para:

   `https://YOUR_DOMAIN/api/webhooks/stripe`

   Evento: `checkout.session.completed`.

4. Coloque o `whsec_…` de produção em `STRIPE_WEBHOOK_SECRET` e atualize `NEXT_PUBLIC_APP_URL` para o domínio público.

## Fora do escopo

Contas de comprador, CRM de estoque, envio físico, e-mail transacional completo, multi-loja, etc. Este projeto é uma demo de portfólio focada em catálogo + Checkout + webhook → pedidos + admin leve.
