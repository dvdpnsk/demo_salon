"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface SuccessStepProps {
  managementToken: string | null;
}

export function SuccessStep({ managementToken }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl text-white"
      >
        ✓
      </motion.div>
      <h2 className="font-display text-2xl text-foreground">
        Dein Termin ist gebucht!
      </h2>
      <p className="max-w-sm text-foreground-muted">
        Wir freuen uns auf dich im Studio.
      </p>

      {managementToken && (
        <div className="mt-4 max-w-sm rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm text-foreground-muted">
            Diesen Link brauchst du, um deinen Termin später einzusehen oder
            zu stornieren — am besten jetzt merken oder als Lesezeichen
            speichern:
          </p>
          <Link
            href={`/termin/${managementToken}`}
            className="mt-3 inline-block break-all text-sm font-medium text-accent underline"
          >
            /termin/{managementToken}
          </Link>
        </div>
      )}

      <Link
        href="/"
        className="mt-4 rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
