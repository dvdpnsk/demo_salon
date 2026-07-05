import { TeamGrid } from "../_components/team-grid";

export default function Team() {
  return (
    <main className="px-6 pt-40 pb-28">
      <div className="mx-auto max-w-5xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Unser Team
        </span>
<h1 className="mt-3 break-words font-display text-4xl text-foreground sm:text-5xl">
          Menschen, die deinen Look verstehen.
        </h1>
        <p className="mt-6 max-w-lg text-lg text-foreground-muted">
          Jeder bringt seine eigene Handschrift mit — gemeinsam sorgen wir
          dafür, dass du dich bei uns wohlfühlst.
        </p>

        <div className="mt-16">
          <TeamGrid />
        </div>
      </div>
    </main>
  );
}
