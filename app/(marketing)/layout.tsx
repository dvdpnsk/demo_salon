import type { Metadata } from "next";
import "@/app/globals.css";
import { fraunces, hankenGrotesk } from "@/lib/fonts";
import { SiteHeader } from "@/app/_components/site-header";
import { SiteFooter } from "@/app/_components/site-footer";

export const metadata: Metadata = {
  title: "Amara Studio — Beauty & Hair",
  description:
    "Beauty-Studio für Haare, Nails und Brows. Termine einfach online buchen.",
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
