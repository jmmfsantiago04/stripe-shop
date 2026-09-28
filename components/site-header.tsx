import Image from "next/image";
import Link from "next/link";
import { CartLink } from "@/components/cart-link";

export function SiteHeader() {
  return (
    <header className="border-b border-lumen-line bg-lumen-cream/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Lumen Desk — início"
        >
          <Image
            src="/lumen-desk-mark-nav.png"
            alt="Lumen Desk"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/#produtos"
            className="text-lumen-muted transition-colors hover:text-lumen-blue"
          >
            Produtos
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
