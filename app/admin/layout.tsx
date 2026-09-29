import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-lumen-cream text-lumen-ink">
      <header className="border-b border-lumen-line bg-lumen-cream/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/admin/orders"
            className="font-display text-lg font-semibold text-lumen-ink"
          >
            Lumen Desk · Admin
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
