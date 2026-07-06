"use client";

import { useMemo, useState } from "react";
import { deleteExpense } from "@/lib/actions/expenses";
import { ConfirmSubmitButton } from "@/app/admin/_components/confirm-submit-button";
import { CURRENCY_FORMATTER } from "@/lib/format";

const DATE_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

interface ExpenseItem {
  id: string;
  date: string;
  note: string | null;
  amountCents: number;
  category: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

interface ExpenseListProps {
  expenses: ExpenseItem[];
  categories: Category[];
}

export function ExpenseList({ expenses, categories }: ExpenseListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const filtered = useMemo(
    () =>
      selectedCategory
        ? expenses.filter((expense) => expense.category.id === selectedCategory)
        : expenses,
    [expenses, selectedCategory]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl text-foreground">
          Ausgaben im Zeitraum
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === null
                ? "bg-accent text-white"
                : "border border-border text-foreground-muted hover:text-foreground"
            }`}
          >
            Alle
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-accent text-white"
                  : "border border-border text-foreground-muted hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-140 text-left text-sm">
          <thead>
            <tr className="border-b border-border text-foreground-muted">
              <th className="px-4 py-3 font-medium">Datum</th>
              <th className="px-4 py-3 font-medium">Kategorie</th>
              <th className="px-4 py-3 font-medium">Notiz</th>
              <th className="px-4 py-3 font-medium">Betrag</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-foreground-muted"
                >
                  Keine Ausgaben in diesem Zeitraum.
                </td>
              </tr>
            )}
            {filtered.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-border last:border-none"
              >
                <td className="px-4 py-3 text-foreground">
                  {DATE_FORMATTER.format(new Date(expense.date))}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {expense.category.name}
                </td>
                <td className="px-4 py-3 text-foreground-muted">
                  {expense.note ?? "–"}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {CURRENCY_FORMATTER.format(expense.amountCents / 100)}
                </td>
                <td className="px-4 py-3">
                  <form action={deleteExpense}>
                    <input type="hidden" name="id" value={expense.id} />
                    <ConfirmSubmitButton
                      label="Löschen"
                      confirmMessage="Diese Ausgabe wirklich löschen?"
                      className="text-sm font-medium text-red-600 hover:underline"
                    />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
