"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const categories = ["Alle", "Haare", "Nails", "Brows"];

const images = [
  { id: 1, label: "Balayage", category: "Haare", height: "h-72" },
  { id: 2, label: "Updo", category: "Haare", height: "h-56" },
  { id: 3, label: "Gel-Nails", category: "Nails", height: "h-64" },
  { id: 4, label: "Brow Lamination", category: "Brows", height: "h-52" },
  { id: 5, label: "Coloration", category: "Haare", height: "h-80" },
  { id: 6, label: "Nail Art", category: "Nails", height: "h-60" },
  { id: 7, label: "Wimpernlifting", category: "Brows", height: "h-64" },
  { id: 8, label: "Herrenschnitt", category: "Haare", height: "h-56" },
];

export function Gallery() {
  const [active, setActive] = useState("Alle");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered =
    active === "Alle"
      ? images
      : images.filter((img) => img.category === active);

  const selectedImage = images.find((img) => img.id === selected);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active === category
                ? "bg-accent text-white"
                : "border border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

<div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
  <AnimatePresence mode="popLayout">
    {filtered.map((image, index) => (
      <motion.button
        key={image.id}
        layout
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ clipPath: "inset(0 0 0% 0)" }}
        exit={{ opacity: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.8,
          delay: (index % 3) * 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setSelected(image.id)}
        className={`group relative mb-4 block w-full overflow-hidden rounded-2xl bg-surface ${image.height}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--accent-soft),transparent_60%),radial-gradient(circle_at_70%_80%,var(--accent),transparent_55%)] transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute bottom-4 left-4 text-sm font-medium text-white drop-shadow">
          {image.label}
        </span>
      </motion.button>
    ))}
  </AnimatePresence>
</div>




      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/90 p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-4/5 w-full max-w-md overflow-hidden rounded-3xl bg-surface"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--accent-soft),transparent_60%),radial-gradient(circle_at_70%_80%,var(--accent),transparent_55%)]" />
              <span className="absolute bottom-6 left-6 font-display text-2xl text-white drop-shadow">
                {selectedImage.label}
              </span>
              <button
                onClick={() => setSelected(null)}
                aria-label="Schließen"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
