import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Lumen Desk",
    template: "%s · Lumen Desk",
  },
  description:
    "Loja demo de portfolio: periféricos e desk setup com Neon e Stripe Checkout.",
  icons: {
    icon: "/lumen-desk-mark.png",
    apple: "/lumen-desk-mark.png",
  },
  openGraph: {
    title: "Lumen Desk",
    description:
      "Periféricos e acessórios para desk setup. Demo de portfolio com Neon e Stripe.",
    siteName: "Lumen Desk",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/lumen-desk-lockup.png",
        alt: "Lumen Desk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumen Desk",
    description:
      "Periféricos e acessórios para desk setup. Demo de portfolio com Neon e Stripe.",
    images: ["/lumen-desk-lockup.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-lumen-cream text-lumen-ink">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
