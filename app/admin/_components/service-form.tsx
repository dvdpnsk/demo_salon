const CATEGORIES = [
  { value: "HAARE", label: "Haare" },
  { value: "NAILS", label: "Nails" },
  { value: "BROWS", label: "Brows & Lashes" },
  { value: "PFLEGE", label: "Pflege" },
];

interface ServiceFormProps {
  action: (formData: FormData) => void;
  submitLabel: string;
  initial?: {
    name: string;
    category: string;
    durationMinutes: number;
    priceCents: number;
  };
}

export function ServiceForm({ action, submitLabel, initial }: ServiceFormProps) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={initial?.name}
          className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="category"
          className="text-sm font-medium text-foreground"
        >
          Kategorie
        </label>
        <select
          id="category"
          name="category"
          defaultValue={initial?.category ?? "HAARE"}
          className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
        >
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="durationMinutes"
            className="text-sm font-medium text-foreground"
          >
            Dauer (Min.)
          </label>
          <input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min={5}
            step={5}
            required
            defaultValue={initial?.durationMinutes}
            className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="price"
            className="text-sm font-medium text-foreground"
          >
            Preis (€)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step={0.5}
            required
            defaultValue={
              initial ? (initial.priceCents / 100).toFixed(2) : undefined
            }
            className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        {submitLabel}
      </button>
    </form>
  );
}
