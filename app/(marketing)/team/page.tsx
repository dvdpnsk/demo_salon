import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { TeamGrid } from "@/app/_components/team-grid";

export const metadata: Metadata = {
  title: "Unser Team",
  description:
    "Lerne das Team von Amara Studio kennen — erfahrene Stylist:innen für Haare, Nails und Brows in Berlin.",
};

export const dynamic = "force-dynamic";

export default async function Team() {
  const staff = await prisma.staff.findMany({
    orderBy: { name: "asc" },
    include: { services: { include: { service: true } } },
  });

  const members = staff.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.bio,
    imageUrl: member.imageUrl,
    specialties: member.services.map((s) => s.service.name),
  }));

  return (
    <main className="px-6 pt-40 pb-28">
      <div className="mx-auto max-w-5xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Unser Team
        </span>
        <h1 className="mt-3 wrap-break-word font-display text-4xl text-foreground sm:text-5xl">
          Menschen, die deinen Look verstehen.
        </h1>
        <p className="mt-6 max-w-lg text-lg text-foreground-muted">
          Jeder bringt seine eigene Handschrift mit — gemeinsam sorgen wir
          dafür, dass du dich bei uns wohlfühlst.
        </p>

        <div className="mt-16">
          <TeamGrid members={members} />
        </div>
      </div>
    </main>
  );
}
