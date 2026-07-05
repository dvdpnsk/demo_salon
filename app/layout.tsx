import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./_components/site-header";
import { SiteFooter } from "./_components/site-footer";



const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Amara Studio — Beauty & Hair",
  description:
    "Beauty-Studio für Haare, Nails und Brows. Termine einfach online buchen.",
};

export default function RootLayout({
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
