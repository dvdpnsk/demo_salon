"use client";

import { motion, type Variants } from "motion/react";

const team = [
  {
    name: "Lena Vogt",
    role: "Salonleitung & Coloration",
    bio: "Seit über zwölf Jahren im Handwerk zu Hause. Lena leitet das Studio und ist auf komplexe Coloration-Techniken spezialisiert.",
    specialties: ["Balayage", "Farbkorrektur", "Beratung"],
  },
  {
    name: "Amara Keller",
    role: "Hair Styling & Schnitt",
    bio: "Schneidet seit über zehn Jahren und findet für jede Kopfform den passenden Schnitt — präzise, aber nie steif.",
    specialties: ["Damenschnitt", "Styling", "Hochsteckfrisuren"],
  },
  {
    name: "Nora Islam",
    role: "Nails & Brows",
    bio: "Präzision im Detail — von natürlichen Brows bis zu aufwendigem Nail-Art, immer mit Blick fürs Ganze.",
    specialties: ["Gel-Modellage", "Brow Lamination", "Nail Art"],
  },
  {
    name: "Jonas Reimer",
    role: "Herrenschnitt & Bartpflege",
    bio: "Klassisch geschult, modern im Blick — für den Schnitt, der auch in zwei Wochen noch sitzt.",
    specialties: ["Herrenschnitt", "Bartpflege", "Fade"],
  },
];

const cardVariants: Variants = {
  hidden: {},
  visible: {},
};

const avatarVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, delay: 0, ease: [0.16, 1, 0.3, 1] },
  },
};

const nameVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] },
  },
};

const bioVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

const tagsVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.35 } },
};

export function TeamGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {team.map((member) => (
        <motion.div
          key={member.name}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={cardVariants}
          className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 sm:gap-5 sm:p-8"
        >
          <motion.div
            variants={avatarVariants}
            className="h-16 w-16 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--accent-soft),transparent_65%),radial-gradient(circle_at_70%_75%,var(--accent),transparent_60%)] sm:h-24 sm:w-24"
          />
          <motion.div variants={nameVariants}>
            <h2 className="font-display text-xl text-foreground sm:text-2xl">
              {member.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-accent">
              {member.role}
            </p>
          </motion.div>
          <motion.p
            variants={bioVariants}
            className="text-sm leading-relaxed text-foreground-muted"
          >
            {member.bio}
          </motion.p>
          <motion.div
            variants={tagsVariants}
            className="flex flex-wrap gap-2"
          >
            {member.specialties.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
