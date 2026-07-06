import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Amara Studio.",
};

export default function Datenschutz() {
  return (
    <main className="px-6 pt-40 pb-28">
      <div className="mx-auto max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Rechtliches
        </span>
        <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
          Datenschutzerklärung
        </h1>

        <div className="mt-12 flex flex-col gap-10 text-foreground-muted">
          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              1. Verantwortlicher
            </h2>
            <p className="mt-3">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              <br />
              Amara Studio, Inh. Lena Vogt, Lindenstraße 14, 10969 Berlin
              <br />
              E-Mail: hallo@amara-studio.de
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              2. Welche Daten wir bei einer Buchung verarbeiten
            </h2>
            <p className="mt-3">
              Wenn du über unsere Website einen Termin buchst, erheben wir
              deinen Namen, deine E-Mail-Adresse und deine Telefonnummer sowie
              die Details des gebuchten Termins (Service, Mitarbeiter:in,
              Datum, Uhrzeit). Diese Angaben benötigen wir, um den Termin zu
              vereinbaren, dich zu kontaktieren und dir eine
              Bestätigungs- sowie Erinnerungsmail zuzusenden.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              3. Rechtsgrundlage
            </h2>
            <p className="mt-3">
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b
              DSGVO, da sie zur Erfüllung eines Vertrags bzw. zur Durchführung
              vorvertraglicher Maßnahmen (Terminvereinbarung) erforderlich
              ist.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              4. Weitergabe an Dritte
            </h2>
            <p className="mt-3">
              Für den Versand von Bestätigungs- und Erinnerungsmails nutzen
              wir den E-Mail-Dienstleister Resend. Unsere Datenbank und das
              Hosting dieser Website laufen über Neon (Datenbank) und Vercel
              (Hosting). Diese Anbieter verarbeiten Daten ausschließlich in
              unserem Auftrag und gemäß unseren Weisungen (Auftragsverarbeitung
              nach Art. 28 DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              5. Speicherdauer
            </h2>
            <p className="mt-3">
              Wir speichern deine Daten so lange, wie es für die
              Terminabwicklung und etwaige gesetzliche
              Aufbewahrungspflichten erforderlich ist. Über den geheimen Link
              in deiner Bestätigungsmail kannst du deinen Termin jederzeit
              selbst einsehen oder stornieren.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              6. Deine Rechte
            </h2>
            <p className="mt-3">
              Du hast das Recht auf Auskunft, Berichtigung, Löschung und
              Einschränkung der Verarbeitung deiner personenbezogenen Daten
              sowie ein Widerspruchsrecht gegen die Verarbeitung. Wende dich
              dazu einfach an die oben genannte E-Mail-Adresse. Außerdem
              steht dir ein Beschwerderecht bei der zuständigen
              Datenschutzaufsichtsbehörde zu.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground">
              7. Cookies
            </h2>
            <p className="mt-3">
              Diese Website verwendet ausschließlich technisch notwendige
              Cookies bzw. Session-Daten, die für den Betrieb des
              Admin-Bereichs erforderlich sind. Es findet kein Tracking und
              keine Analyse deines Nutzungsverhaltens statt.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
