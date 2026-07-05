import { ServiceCategories } from "../_components/service-categories";

export default function Leistungen() {
  return (
    <main className="px-6 pt-40 pb-28">
      <div className="mx-auto max-w-4xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Preise & Leistungen
        </span>
<h1 className="mt-3 font-display text-3xl text-foreground hyphens-auto sm:text-4xl lg:text-5xl">
          Transparent, fair, ohne Überraschungen.
        </h1>
        <p className="mt-6 max-w-lg text-lg text-foreground-muted">
          Alle Preise verstehen sich als Richtwert — je nach Haarlänge und
          Aufwand beraten wir dich individuell vor jedem Termin.
        </p>

        <div className="mt-16">
          <ServiceCategories />
        </div>

<div className="mt-16 text-center">
  <a
    href="/buchen"
    className="inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
  >
    Termin buchen
  </a>
</div>

      </div>
    </main>
  );
}
