"use client";

import { motion, type Variants } from "motion/react";

export interface TeamTeaserMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
}

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.9, rotateX: 8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 3, ease: [0.16, 1, 0.3, 1] },
  },
};

interface TeamCarouselProps {
  members: TeamTeaserMember[];
}

export function TeamCarousel({ members }: TeamCarouselProps) {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Unser Team
          </span>
          <h2 className="mt-3 font-display text-4xl text-foreground">
            Menschen, die deinen Look verstehen.
          </h2>
          <a
            href="/team"
            className="mt-4 inline-block text-sm font-medium text-foreground underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
          >
            Ganzes Team ansehen →
          </a>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ perspective: 1000 }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {members.map((member) => (
            <motion.div
              key={member.id}
              variants={card}
              className="flex flex-col gap-5 rounded-3xl border border-border bg-surface p-8 sm:p-10"
            >
              <div className="h-28 w-28 overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--accent-soft),transparent_65%),radial-gradient(circle_at_70%_75%,var(--accent),transparent_60%)]">
                {member.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="font-display text-2xl text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-accent">
                  {member.role}
                </p>
              </div>
              {member.bio && (
                <p className="text-sm leading-relaxed text-foreground-muted">
                  {member.bio}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
