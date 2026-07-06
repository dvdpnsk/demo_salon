const CATEGORY_LABELS: Record<string, string> = {
  HAARE: "Haare",
  NAILS: "Nails",
  BROWS: "Brows & Lashes",
  PFLEGE: "Pflege",
};

interface StaffFormProps {
  action: (formData: FormData) => void;
  submitLabel: string;
  services: { id: string; name: string; category: string }[];
  initial?: {
    name: string;
    role: string;
    bio: string | null;
    serviceIds: string[];
  };
}

export function StaffForm({
  action,
  submitLabel,
  services,
  initial,
}: StaffFormProps) {
  const categories = Array.from(new Set(services.map((s) => s.category)));

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
        <label htmlFor="role" className="text-sm font-medium text-foreground">
          Rolle
        </label>
        <input
          id="role"
          name="role"
          required
          defaultValue={initial?.role}
          placeholder="z. B. Hair Styling & Schnitt"
          className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="bio" className="text-sm font-medium text-foreground">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={initial?.bio ?? ""}
          className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-foreground">
          Bietet an
        </span>
        {categories.map((category) => (
          <div key={category}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground-muted">
              {CATEGORY_LABELS[category] ?? category}
            </p>
            <div className="flex flex-col gap-2">
              {services
                .filter((service) => service.category === category)
                .map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <input
                      type="checkbox"
                      name="serviceIds"
                      value={service.id}
                      defaultChecked={initial?.serviceIds.includes(service.id)}
                      className="h-4 w-4 rounded border-border"
                    />
                    {service.name}
                  </label>
                ))}
            </div>
          </div>
        ))}
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
