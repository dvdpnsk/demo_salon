import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteStaff } from "@/lib/actions/staff";
import { ConfirmSubmitButton } from "@/app/admin/_components/confirm-submit-button";

export default async function AdminTeamPage() {
  const staff = await prisma.staff.findMany({
    orderBy: { name: "asc" },
    include: { services: { include: { service: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Team</h1>
          <p className="mt-1 text-foreground-muted">
            Mitarbeiter:innen verwalten.
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          + Neues Teammitglied
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {staff.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {member.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.imageUrl}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--accent-soft),transparent_65%),radial-gradient(circle_at_70%_75%,var(--accent),transparent_60%)]" />
                )}
                <div>
                  <h2 className="font-display text-lg text-foreground">
                    {member.name}
                  </h2>
                  <p className="text-sm text-foreground-muted">
                    {member.role}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-3">
                <Link
                  href={`/admin/team/${member.id}/edit`}
                  className="text-sm font-medium text-foreground hover:text-accent"
                >
                  Bearbeiten
                </Link>
                <form action={deleteStaff}>
                  <input type="hidden" name="id" value={member.id} />
                  <ConfirmSubmitButton
                    label="Löschen"
                    confirmMessage={`Teammitglied "${member.name}" wirklich löschen?`}
                    className="text-sm font-medium text-red-600 hover:underline"
                  />
                </form>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {member.services.map((s) => (
                <span
                  key={s.serviceId}
                  className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-foreground"
                >
                  {s.service.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
