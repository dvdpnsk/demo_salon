import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createExpense } from "@/lib/actions/expenses";
import {
  createExpenseCategory,
  deleteExpenseCategory,
} from "@/lib/actions/expense-categories";
import { CURRENCY_FORMATTER } from "@/lib/format";
import { ConfirmSubmitButton } from "@/app/admin/_components/confirm-submit-button";
import { ExpenseList } from "@/app/admin/_components/expense-list";

const PERIODS = [
  { value: "today", label: "Heute" },
  { value: "week", label: "Diese Woche" },
  { value: "month", label: "Dieser Monat" },
] as const;

function getRange(period: string, from?: string, to?: string) {
  if (from && to) {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(to);
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      return { start, end };
    }
  }

  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (period === "today") {
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start, end };
  }

  if (period === "week") {
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { start, end };
  }

  start.setDate(1);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return { start, end };
}

const DATE_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

interface FinanzenPageProps {
  searchParams: Promise<{ period?: string; from?: string; to?: string }>;
}

export default async function FinanzenPage({
  searchParams,
}: FinanzenPageProps) {
  const { period: periodParam, from, to } = await searchParams;
  const period =
    periodParam === "today" || periodParam === "week" ? periodParam : "month";
  const isCustomRange = Boolean(from && to);
  const { start, end } = getRange(period, from, to);

  const [bookings, expenses, categories] = await Promise.all([
    prisma.booking.findMany({
      where: {
        startTime: { gte: start, lt: end },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      orderBy: { startTime: "asc" },
      include: { service: true, customer: true },
    }),
    prisma.expense.findMany({
      where: { date: { gte: start, lt: end } },
      orderBy: { date: "desc" },
      include: { category: true },
    }),
    prisma.expenseCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  const revenueCents = bookings.reduce(
    (sum, booking) => sum + booking.service.priceCents,
    0
  );
  const expensesCents = expenses.reduce(
    (sum, expense) => sum + expense.amountCents,
    0
  );
  const profitCents = revenueCents - expensesCents;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-foreground">Finanzen</h1>
        <p className="mt-1 text-foreground-muted">
          Umsatz, Ausgaben und Gewinn im Überblick.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <Link
              key={p.value}
              href={`/admin/finanzen?period=${p.value}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !isCustomRange && period === p.value
                  ? "bg-accent text-white"
                  : "border border-border text-foreground-muted hover:text-foreground"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>

        <form
          action="/admin/finanzen"
          className="flex flex-wrap items-end gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="from"
              className="text-sm font-medium text-foreground"
            >
              Von
            </label>
            <input
              id="from"
              name="from"
              type="date"
              defaultValue={from}
              className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="to"
              className="text-sm font-medium text-foreground"
            >
              Bis
            </label>
            <input
              id="to"
              name="to"
              type="date"
              defaultValue={to}
              className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              isCustomRange
                ? "bg-accent text-white"
                : "border border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            Zeitraum anwenden
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-foreground-muted">
            Umsatz ({bookings.length} Termine)
          </p>
          <p className="mt-2 font-display text-3xl text-foreground">
            {CURRENCY_FORMATTER.format(revenueCents / 100)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-foreground-muted">Ausgaben</p>
          <p className="mt-2 font-display text-3xl text-foreground">
            {CURRENCY_FORMATTER.format(expensesCents / 100)}
          </p>
        </div>
        <div className="rounded-2xl border border-accent bg-accent-soft p-6">
          <p className="text-sm text-foreground-muted">Gewinn</p>
          <p className="mt-2 font-display text-3xl text-foreground">
            {CURRENCY_FORMATTER.format(profitCents / 100)}
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl text-foreground">
          Einnahmen im Zeitraum
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-140 text-left text-sm">
            <thead>
              <tr className="border-b border-border text-foreground-muted">
                <th className="px-4 py-3 font-medium">Datum</th>
                <th className="px-4 py-3 font-medium">Kundin</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Betrag</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-foreground-muted"
                  >
                    Keine Einnahmen in diesem Zeitraum.
                  </td>
                </tr>
              )}
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-border last:border-none"
                >
                  <td className="px-4 py-3 text-foreground">
                    {DATE_FORMATTER.format(booking.startTime)}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {booking.customer.name}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {booking.service.name}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {CURRENCY_FORMATTER.format(booking.service.priceCents / 100)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl text-foreground">
          Ausgaben-Kategorien
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
            >
              {cat.name}
              <form action={deleteExpenseCategory}>
                <input type="hidden" name="id" value={cat.id} />
                <ConfirmSubmitButton
                  label="✕"
                  ariaLabel={`${cat.name} löschen`}
                  confirmMessage={`Kategorie "${cat.name}" wirklich löschen?`}
                  className="text-foreground-muted hover:text-red-600"
                />
              </form>
            </span>
          ))}
        </div>
        <form
          action={createExpenseCategory}
          className="mt-4 flex max-w-md items-end gap-3"
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <label
              htmlFor="categoryName"
              className="text-sm font-medium text-foreground"
            >
              Neue Kategorie
            </label>
            <input
              id="categoryName"
              name="name"
              required
              placeholder="z. B. Weiterbildung"
              className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent"
          >
            Anlegen
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-xl text-foreground">
          Ausgabe erfassen
        </h2>
        <form
          action={createExpense}
          className="mt-4 flex max-w-xl flex-wrap items-end gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="categoryId"
              className="text-sm font-medium text-foreground"
            >
              Kategorie
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="note"
              className="text-sm font-medium text-foreground"
            >
              Notiz (optional)
            </label>
            <input
              id="note"
              name="note"
              placeholder="z. B. Juli-Miete"
              className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-foreground"
            >
              Betrag (€)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              className="w-32 rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="date"
              className="text-sm font-medium text-foreground"
            >
              Datum
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Hinzufügen
          </button>
        </form>
      </div>

      <ExpenseList
        expenses={expenses.map((expense) => ({
          id: expense.id,
          date: expense.date.toISOString(),
          note: expense.note,
          amountCents: expense.amountCents,
          category: { id: expense.category.id, name: expense.category.name },
        }))}
        categories={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
      />
    </div>
  );
}
