import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Amara Studio gemäß § 5 TMG.",
};

export default function Impressum() {
  return (
    <main className="px-6 pt-40 pb-28">
      <div className="mx-auto max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Rechtliches
        </span>
        <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
          Impressum
        </h1>

        <div className="mt-12 flex flex-col gap-10 text-foreground-muted">
          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              Angaben gemäß § 5 TMG
            </h2>
            <p className="mt-3">
              Amara Studio
              <br />
              Inh. Lena Vogt
              <br />
              Lindenstraße 14
              <br />
              10969 Berlin
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              Kontakt
            </h2>
            <p className="mt-3">
              Telefon: 030 123 456 78
              <br />
              E-Mail: hallo@amara-studio.de
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              Umsatzsteuer-ID
            </h2>
            <p className="mt-3">
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
              DE 123 456 789
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              Redaktionell verantwortlich
            </h2>
            <p className="mt-3">
              Lena Vogt
              <br />
              Lindenstraße 14
              <br />
              10969 Berlin
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              EU-Streitschlichtung
            </h2>
            <p className="mt-3">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                ec.europa.eu/consumers/odr
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind
              nicht verpflichtet und nicht bereit, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
