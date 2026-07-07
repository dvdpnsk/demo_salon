"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const categories = ["Alle", "Haare", "Nägel", "Augenbrauen"];

const images = [
  {
    id: 1,
    label: "Balayage",
    category: "Haare",
    height: "h-72",
    image:
      "https://images.unsplash.com/photo-1707720531504-ce087725861a?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 2,
    label: "Hochsteckfrisur",
    category: "Haare",
    height: "h-56",
    image:
      "https://images.unsplash.com/photo-1769869174682-19e960909bdb?w=600&h=600&fit=crop&q=80",
  },
  {
    id: 3,
    label: "Gel-Nägel",
    category: "Nägel",
    height: "h-64",
    image:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&h=700&fit=crop&q=80",
  },
  {
    id: 4,
    label: "Augenbrauenlaminierung",
    category: "Augenbrauen",
    height: "h-52",
    image:
      "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=600&h=560&fit=crop&q=80",
  },
  {
    id: 5,
    label: "Coloration",
    category: "Haare",
    height: "h-80",
    image:
      "https://images.unsplash.com/photo-1707812343087-c9ff9e5abb43?w=600&h=880&fit=crop&q=80",
  },
  {
    id: 6,
    label: "Nageldesign",
    category: "Nägel",
    height: "h-60",
    image:
      "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=600&h=660&fit=crop&q=80",
  },
  {
    id: 7,
    label: "Wimpernlifting",
    category: "Augenbrauen",
    height: "h-64",
    image:
      "https://images.unsplash.com/photo-1639629509821-c54cdd984227?w=600&h=700&fit=crop&q=80",
  },
  {
    id: 8,
    label: "Herrenschnitt",
    category: "Haare",
    height: "h-56",
    image:
      "https://images.unsplash.com/photo-1635273051937-a0ddef9573b6?w=600&h=600&fit=crop&q=80",
  },
];

export function Gallery() {
  const [active, setActive] = useState("Alle");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered =
    active === "Alle"
      ? images
      : images.filter((img) => img.category === active);

  const selectedImage = images.find((img) => img.id === selected);

  useEffect(() => {
    if (!selectedImage) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImage]);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            aria-pressed={active === category}
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.image}
          alt={image.label}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-transparent" />
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
              role="dialog"
              aria-modal="true"
              aria-label={selectedImage.label}
              className="relative aspect-4/5 w-full max-w-md overflow-hidden rounded-3xl bg-surface"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.image}
                alt={selectedImage.label}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-transparent" />
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
