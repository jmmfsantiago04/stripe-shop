export function SiteFooter() {
  return (
    <footer className="border-t border-lumen-line bg-lumen-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-10 text-sm text-lumen-muted sm:px-6">
        <p className="font-display text-base font-semibold text-lumen-ink">
          Lumen <span className="text-lumen-amber">Desk</span>
        </p>
        <p>Demo de portfolio · desk setup · Neon · Stripe Checkout</p>
        <p className="text-xs">
          Pagamentos em modo teste. Não é uma loja real.
        </p>
      </div>
    </footer>
  );
}
