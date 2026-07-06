import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateWorkingHours } from "@/lib/actions/working-hours";

const WEEKDAY_LABELS = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

interface ArbeitszeitenPageProps {
  searchParams: Promise<{ staff?: string }>;
}

export default async function ArbeitszeitenPage({
  searchParams,
}: ArbeitszeitenPageProps) {
  const { staff: staffParam } = await searchParams;

  const staffList = await prisma.staff.findMany({ orderBy: { name: "asc" } });
  const activeStaff = staffList.find((s) => s.id === staffParam) ?? staffList[0];

  if (!activeStaff) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-3xl text-foreground">
          Arbeitszeiten
        </h1>
        <p className="text-foreground-muted">
          Lege zuerst ein Teammitglied an.
        </p>
      </div>
    );
  }

  const workingHours = await prisma.workingHours.findMany({
    where: { staffId: activeStaff.id },
  });
  const hoursByWeekday = new Map(workingHours.map((wh) => [wh.weekday, wh]));

  const updateAction = updateWorkingHours.bind(null, activeStaff.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">
          Arbeitszeiten
        </h1>
        <p className="mt-1 text-foreground-muted">
          Wöchentliche Verfügbarkeit pro Mitarbeiter:in.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {staffList.map((member) => (
          <Link
            key={member.id}
            href={`/admin/arbeitszeiten?staff=${member.id}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              member.id === activeStaff.id
                ? "bg-accent text-white"
                : "border border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            {member.name}
          </Link>
        ))}
      </div>

      <form action={updateAction} className="flex max-w-xl flex-col gap-3">
        {WEEKDAY_LABELS.map((label, weekday) => {
          const existing = hoursByWeekday.get(weekday);
          return (
            <div
              key={weekday}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <label className="flex w-32 shrink-0 items-center gap-2 text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  name={`open-${weekday}`}
                  defaultChecked={Boolean(existing)}
                  className="h-4 w-4 rounded border-border"
                />
                {label}
              </label>
              <input
                type="time"
                name={`start-${weekday}`}
                defaultValue={
                  existing ? minutesToTime(existing.startMinute) : "09:00"
                }
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
              <span className="text-foreground-muted">–</span>
              <input
                type="time"
                name={`end-${weekday}`}
                defaultValue={
                  existing ? minutesToTime(existing.endMinute) : "18:00"
                }
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </div>
          );
        })}

        <button
          type="submit"
          className="mt-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Speichern
        </button>
      </form>
    </div>
  );
}
