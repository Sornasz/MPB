const MONTHS_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const WEEKDAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

function parseDate(iso: string): Date {
  // Prefer date-only parsing to avoid timezone shifts
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (m) {
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  return new Date(iso);
}

export function formatDayMonth(iso: string): string {
  const d = parseDate(iso);
  return `${MONTHS_SHORT[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
}

export function formatLongDate(iso: string): string {
  const d = parseDate(iso);
  return `${MONTHS_SHORT[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}, ${d.getFullYear()}`;
}

export function formatWeekdayLong(iso: string): string {
  const d = parseDate(iso);
  return `${WEEKDAYS[d.getDay()]} · ${formatLongDate(iso)}`;
}

export function formatMonthYear(iso: string): string {
  const d = parseDate(iso);
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

export function monthKey(iso: string): string {
  const d = parseDate(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function yearKey(iso: string): string {
  return String(parseDate(iso).getFullYear());
}

export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${hh}:${mm}:00`;
}

export function formatEntryNumber(n: number): string {
  return `No. ${String(n).padStart(3, "0")}`;
}

export function distinctMonthCount(dates: string[]): number {
  return new Set(dates.map(monthKey)).size;
}
