"use client";

import { motion, type Variants } from "motion/react";

const categories = [
  {
    number: "01",
    title: "Haare",
    items: [
      { name: "Schnitt Damen", price: "ab 45 €" },
      { name: "Schnitt Herren", price: "ab 30 €" },
      { name: "Coloration", price: "ab 75 €" },
      { name: "Balayage", price: "ab 120 €" },
      { name: "Föhnen & Styling", price: "ab 25 €" },
    ],
  },
  {
    number: "02",
    title: "Nails",
    items: [
      { name: "Maniküre klassisch", price: "ab 35 €" },
      { name: "Gel-Modellage", price: "ab 55 €" },
      { name: "Nail Art (Aufpreis)", price: "ab 10 €" },
    ],
  },
  {
    number: "03",
    title: "Brows & Lashes",
    items: [
      { name: "Augenbrauen zupfen", price: "ab 15 €" },
      { name: "Brow Lamination", price: "ab 35 €" },
      { name: "Wimpernlifting", price: "ab 45 €" },
    ],
  },
  {
    number: "04",
    title: "Pflege",
    items: [
      { name: "Kopfhautbehandlung", price: "ab 30 €" },
      { name: "Intensiv-Haarkur", price: "ab 20 €" },
    ],
  },
];

const cardVariants: Variants = {
  hidden: {},
  visible: {},
};

const numberVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: 0, ease: [0.16, 1, 0.3, 1] },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] },
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ServiceCategories() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {categories.map((category) => (
        <motion.div
          key={category.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={cardVariants}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8"
        >
          <motion.span
            variants={numberVariants}
            className="block font-display text-5xl text-accent-soft sm:text-6xl"
          >
            {category.number}
          </motion.span>
          <motion.h2
            variants={titleVariants}
            className="mt-2 font-display text-xl text-foreground sm:text-2xl"
          >
            {category.title}
          </motion.h2>
          <motion.div variants={listVariants} className="mt-6 flex flex-col">
            {category.items.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-none"
              >
                <span className="text-foreground">{item.name}</span>
                <span className="whitespace-nowrap text-foreground-muted">
                  {item.price}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
