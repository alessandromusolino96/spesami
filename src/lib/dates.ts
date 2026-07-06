import { addDays, addMonths, endOfMonth, format, isAfter, isSameDay, startOfDay, startOfMonth, subMonths } from "date-fns";
import { it } from "date-fns/locale";
import { toDateInputValue } from "./format";

export function todayISO(): string {
  return toDateInputValue(new Date());
}

export function formatDayLabel(date: Date): string {
  return format(date, "EEEE d MMMM", { locale: it });
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function canGoToNextDay(date: Date): boolean {
  const nextDay = startOfDay(addDays(date, 1));
  const today = startOfDay(new Date());
  return !isAfter(nextDay, today);
}

export function formatMonthLabel(date: Date): string {
  return format(date, "MMMM yyyy", { locale: it });
}

export function getMonthRange(date: Date): { start: string; end: string } {
  return {
    start: toDateInputValue(startOfMonth(date)),
    end: toDateInputValue(endOfMonth(date)),
  };
}

export function getCurrentMonthRange(): { start: string; end: string } {
  return getMonthRange(new Date());
}

export function getPreviousMonthRange(): { start: string; end: string } {
  return getMonthRange(subMonths(new Date(), 1));
}

export function canGoToNextMonth(date: Date): boolean {
  const nextMonth = startOfMonth(addMonths(date, 1));
  const currentMonth = startOfMonth(new Date());
  return !isAfter(nextMonth, currentMonth);
}

export function isInRange(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}

export function capitalizeFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
