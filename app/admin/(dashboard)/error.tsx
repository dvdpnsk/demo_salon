"use client";

interface AdminErrorProps {
  error: Error;
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="max-w-md text-red-600">
        {error.message || "Etwas ist schiefgelaufen."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Erneut versuchen
      </button>
    </div>
  );
}
