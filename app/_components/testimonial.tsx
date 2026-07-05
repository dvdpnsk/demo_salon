"use client";

import { motion } from "motion/react";

export function Testimonial() {
  return (
    <section className="bg-foreground px-6 py-28 text-background">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="font-display text-6xl text-accent">&ldquo;</span>
        <p className="mt-2 font-display text-3xl leading-snug italic sm:text-4xl">
          Ich fühle mich hier nicht wie eine Kundin, sondern wie eine
          Freundin, die zufällig gerade die besten Haare der Stadt bekommt.
        </p>
        <p className="mt-8 text-sm uppercase tracking-[0.2em] text-muted-on-dark">
          Julia M. — Stammkundin seit 2021
        </p>
      </motion.div>
    </section>
  );
}
