"use client";

import { useEffect, useMemo, useState } from "react";
import type { ServiceOption, SlotChoice } from "../booking-wizard";

interface AvailabilityResult {
  staffId: string;
  staffName: string;
  slots: string[];
}

interface DateTimeStepProps {
  service: ServiceOption;
  staffChoice: string | "any";
  selectedSlot: SlotChoice | null;
  onSelect: (slot: SlotChoice) => void;
  onBack: () => void;
}

function getNextDays(count: number) {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() + i);
    days.push(day);
  }
  return days;
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("de-DE", { weekday: "short" });
const DAY_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
});
const TIME_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit",
});

export function DateTimeStep({
  service,
  staffChoice,
  selectedSlot,
  onSelect,
  onBack,
}: DateTimeStepProps) {
  const days = useMemo(() => getNextDays(14), []);
  const [selectedDate, setSelectedDate] = useState(days[0]);
  const [results, setResults] = useState<AvailabilityResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({
      serviceId: service.id,
      date: formatDateKey(selectedDate),
    });
    if (staffChoice !== "any") {
      params.set("staffId", staffChoice);
    }

    fetch(`/api/availability?${params.toString()}`)
      .then((res) => res.json())
      .then((data: AvailabilityResult[]) => {
        if (!cancelled) setResults(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [service.id, staffChoice, selectedDate]);

  const mergedSlots = useMemo(() => {
    const map = new Map<string, string>();
    for (const result of results) {
      for (const time of result.slots) {
        if (!map.has(time)) map.set(time, result.staffId);
      }
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, staffId]) => ({ time, staffId }));
  }, [results]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-foreground">
        Wann passt es dir?
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => {
          const isActive = formatDateKey(day) === formatDateKey(selectedDate);
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => setSelectedDate(day)}
              aria-pressed={isActive}
              className={`flex shrink-0 flex-col items-center rounded-2xl border px-4 py-3 transition-colors ${
                isActive
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-surface hover:border-accent"
              }`}
            >
              <span className="text-xs uppercase text-foreground-muted">
                {WEEKDAY_FORMATTER.format(day)}
              </span>
              <span className="mt-1 font-medium text-foreground">
                {DAY_FORMATTER.format(day)}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-sm text-foreground-muted" aria-live="polite">
          Lade freie Termine…
        </p>
      ) : mergedSlots.length === 0 ? (
        <p className="text-sm text-foreground-muted" aria-live="polite">
          An diesem Tag ist leider nichts frei — probier einen anderen Tag.
        </p>
      ) : (
        <div
          className="grid grid-cols-3 gap-3 sm:grid-cols-4"
          aria-live="polite"
        >
          {mergedSlots.map((slotOption) => {
            const isActive = selectedSlot?.time === slotOption.time;
            return (
              <button
                key={slotOption.time}
                type="button"
                onClick={() => onSelect(slotOption)}
                aria-pressed={isActive}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-surface text-foreground hover:border-accent"
                }`}
              >
                {TIME_FORMATTER.format(new Date(slotOption.time))}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
      >
        ← Zurück
      </button>
    </div>
  );
}
