import { prisma } from "@/lib/prisma";
import { Hero } from "@/app/_components/hero";
import { Testimonial } from "@/app/_components/testimonial";
import { TeamCarousel } from "@/app/_components/team-carousel";

export default async function Home() {
  const staff = await prisma.staff.findMany({
    orderBy: { name: "asc" },
    take: 3,
  });

  const teamTeaser = staff.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.bio,
    imageUrl: member.imageUrl,
  }));

  return (
    <>
      <Hero />

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-3">
          {[
            { value: "12+", label: "Jahre Erfahrung im Team" },
            { value: "100%", label: "Individuelle Typberatung" },
            { value: "< 1 Min.", label: "Online einen Termin sichern" },
          ].map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-display text-4xl text-accent">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-foreground-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <TeamCarousel members={teamTeaser} />

      <Testimonial />

      <section className="px-6 py-28">
<div className="mx-auto max-w-4xl rounded-[2.5rem] bg-accent-soft px-6 py-12 sm:px-10 sm:py-16 text-center">
          <h2 className="font-display text-4xl text-foreground">
            Bereit für deinen neuen Look?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-foreground-muted">
            Sichere dir in unter einer Minute deinen Wunschtermin — ganz ohne
            Anruf.
          </p>
          <a
            href="/buchen"
            className="mt-8 inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Termin buchen
          </a>
        </div>
      </section>

    </>
  );
}
