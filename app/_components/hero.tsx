"use client";

import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.5, 2, 1, 2] },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-40 pb-24 sm:pt-48 sm:pb-32">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <motion.span
            variants={item}
            className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent"
          >
            <span className="h-px w-8 bg-accent" />
            Beauty Studio in Berlin
          </motion.span>

          <motion.h1
            variants={item}
className="max-w-xl font-display text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl"
          >
            Zeit für dich,
            <br />
            <span className="italic text-accent">von Kopf bis Fuß.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-lg text-foreground-muted"
          >
            Haare, Nails und Brows in entspannter Atmosphäre — persönlich
            beraten, präzise umgesetzt, ganz nach deinem Stil.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <a
              href="/buchen"
              className="rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Termin buchen
            </a>
            <a
              href="/leistungen"
              className="rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
            >
              Leistungen entdecken
            </a>
          </motion.div>
        </div>

        <motion.div variants={item} className="relative lg:col-span-5">
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="aspect-4/5 w-full rounded-[2rem] bg-surface bg-[radial-gradient(circle_at_30%_20%,var(--accent-soft),transparent_60%),radial-gradient(circle_at_70%_80%,var(--accent),transparent_55%)] shadow-[0_40px_80px_-30px_rgba(28,18,16,0.35)]"
          />
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-surface px-6 py-4 shadow-lg sm:block">
            <p className="font-display text-2xl text-foreground">4.9/5</p>
            <p className="text-xs text-foreground-muted">
              aus 240+ Bewertungen
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
