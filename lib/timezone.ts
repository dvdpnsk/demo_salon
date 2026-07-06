export const SALON_TIMEZONE = "Europe/Berlin";

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value])
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - date.getTime();
}

// Converts a wall-clock date/time in `timeZone` into the UTC instant it
// represents. Independent of the server process's own local timezone.
export function zonedWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string = SALON_TIMEZONE
): Date {
  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute);
  const offsetMs = getTimeZoneOffsetMs(new Date(naiveUtc), timeZone);
  return new Date(naiveUtc - offsetMs);
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return { year, month, day };
}

export function getZonedDayStart(
  dateKey: string,
  timeZone: string = SALON_TIMEZONE
): Date {
  const { year, month, day } = parseDateKey(dateKey);
  return zonedWallTimeToUtc(year, month, day, 0, 0, timeZone);
}

// Returns the "YYYY-MM-DD" calendar date that `date` falls on when observed
// in `timeZone` (the inverse of getZonedDayStart).
export function getZonedDateKey(
  date: Date,
  timeZone: string = SALON_TIMEZONE
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// Start of the calendar month containing `dateKey`, plus the start of the
// following month — both as "YYYY-MM-DD" keys, using Date.UTC's automatic
// month-overflow normalization (a pure calendar calculation, timezone-safe
// as long as `dateKey` was already resolved via getZonedDateKey).
export function getMonthBoundsKeys(dateKey: string): {
  start: string;
  nextMonthStart: string;
} {
  const { year, month } = parseDateKey(dateKey);
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = new Date(Date.UTC(year, month, 1));
  const nextMonthStart = `${nextMonth.getUTCFullYear()}-${String(
    nextMonth.getUTCMonth() + 1
  ).padStart(2, "0")}-01`;
  return { start, nextMonthStart };
}

export function getWeekdayForDateKey(dateKey: string): number {
  const { year, month, day } = parseDateKey(dateKey);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function addDaysToDateKey(dateKey: string, days: number): string {
  const { year, month, day } = parseDateKey(dateKey);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Parses a <input type="datetime-local"> value ("YYYY-MM-DDTHH:mm"),
// interpreting it as wall-clock time in `timeZone` rather than the
// server process's own local timezone.
export function parseZonedDateTimeLocal(
  value: string,
  timeZone: string = SALON_TIMEZONE
): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  return zonedWallTimeToUtc(
    Number(year),
    Number(month),
    Number(day),
    Number(hour),
    Number(minute),
    timeZone
  );
}
