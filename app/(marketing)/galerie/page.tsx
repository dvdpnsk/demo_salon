import type { Metadata } from "next";
import { Gallery } from "@/app/_components/gallery";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Einblicke in die Arbeit von Amara Studio — Looks von dezent bis mutig.",
};

export default function Galerie() {
  return (
    <main className="px-6 pt-40 pb-28">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Galerie
        </span>
        <h1 className="mt-3 font-display text-3xl text-foreground hyphens-auto sm:text-4xl lg:text-5xl">
          Einblicke in unsere Arbeit.
        </h1>
        <p className="mt-6 max-w-lg text-lg text-foreground-muted">
          Ein paar Looks aus dem Studio — von dezent bis mutig.
        </p>

<Gallery />
      </div>
    </main>
  );
}
