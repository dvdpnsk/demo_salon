import { WhatsappContact } from "@/app/_components/whatsapp-contact";

export default function Kontakt() {
  return (
    <main className="px-6 pt-40 pb-28">
      <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Kontakt
          </span>
          <h1 className="mt-3 font-display text-3xl text-foreground hyphens-auto sm:text-4xl lg:text-5xl">
            Wir freuen uns auf dich.
          </h1>
          <p className="mt-6 max-w-md text-lg text-foreground-muted">
            Schreib uns oder ruf einfach an — wir melden uns meist innerhalb
            eines Werktags zurück.
          </p>

          <div className="mt-10 flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
                Adresse
              </p>
              <p className="mt-1 text-foreground">
                Lindenstraße 14, 10969 Berlin
              </p>
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
                Kontakt
              </p>
              <a
                href="tel:+493012345678"
                className="mt-1 block text-foreground hover:text-accent"
              >
                030 123 456 78
              </a>
              <a
                href="mailto:hallo@amara-studio.de"
                className="block text-foreground hover:text-accent"
              >
                hallo@amara-studio.de
              </a>
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-foreground-muted">
                Öffnungszeiten
              </p>
              <p className="mt-1 text-foreground">Di – Fr: 9:00 – 19:00</p>
              <p className="text-foreground">Sa: 9:00 – 15:00</p>
            </div>
          </div>
        </div>

<WhatsappContact />
      </div>
    </main>
  );
}
