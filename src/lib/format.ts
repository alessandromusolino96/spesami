const eurFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export function formatCurrency(amount: number): string {
  return eurFormatter.format(amount);
}

export function formatDate(date: string | Date): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

export function formatDateShort(date: string | Date): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
  }).format(value);
}

export function toDateInputValue(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseAmountInput(value: string): number {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
