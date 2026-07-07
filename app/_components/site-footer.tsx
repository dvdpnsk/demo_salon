import Link from "next/link";

const footerNav = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/team", label: "Team" },
  { href: "/galerie", label: "Galerie" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col gap-3">
          <span className="font-display text-2xl">Amara Studio</span>
          <p className="max-w-xs text-sm text-muted-on-dark">
            Beauty &amp; Haare im Herzen der Stadt — persönlich, modern,
            entspannt.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium uppercase tracking-wide text-muted-on-dark">
            Navigation
          </span>
          <nav className="flex flex-col gap-2">
            {footerNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-background/90 transition-colors hover:text-accent-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium uppercase tracking-wide text-muted-on-dark">
            Kontakt
          </span>
          <address className="flex flex-col gap-1 text-sm not-italic text-background/90">
            <span>Lindenstraße 14</span>
            <span>10969 Berlin</span>
            <a
              href="tel:+493012345678"
              className="transition-colors hover:text-accent-soft"
            >
              030 123 456 78
            </a>
            <a
              href="mailto:hallo@amara-studio.de"
              className="transition-colors hover:text-accent-soft"
            >
              hallo@amara-studio.de
            </a>
          </address>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium uppercase tracking-wide text-muted-on-dark">
            Öffnungszeiten
          </span>
          <ul className="flex flex-col gap-1 text-sm text-background/90">
            <li>Di – Fr: 9:00 – 19:00</li>
            <li>Sa: 9:00 – 15:00</li>
            <li>So &amp; Mo: geschlossen</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-on-dark sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Amara Studio</span>
          <div className="flex gap-4">
            <Link
              href="/impressum"
              className="transition-colors hover:text-background"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="transition-colors hover:text-background"
            >
              Datenschutz
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-6">
          <a
            href="https://davpin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-on-dark/60 transition-colors hover:text-accent-soft"
          >
            Portfolio-Projekt — eigene Buchungswebsite anfragen ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
