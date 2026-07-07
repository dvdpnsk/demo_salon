import type { Metadata } from "next";
import "@/app/globals.css";
import { fraunces, hankenGrotesk } from "@/lib/fonts";
import { SiteHeader } from "@/app/_components/site-header";
import { SiteFooter } from "@/app/_components/site-footer";

const SITE_URL = process.env.SITE_URL || "http://localhost:3000";
const SITE_NAME = "Amara Studio";
const SITE_DESCRIPTION =
  "Beauty-Studio für Haare, Nails und Brows. Termine einfach online buchen.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Beauty & Hair`, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — Beauty & Hair`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${fraunces.variable} ${hankenGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-body antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
