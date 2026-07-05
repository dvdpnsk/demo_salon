import type { Metadata } from "next";
import "@/app/globals.css";
import { fraunces, hankenGrotesk } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Admin — Amara Studio",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${fraunces.variable} ${hankenGrotesk.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-body antialiased">
        {children}
      </body>
    </html>
  );
}
