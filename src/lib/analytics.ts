import type { Category, CategoryBreakdown, Transaction } from "../types";

export function filterByDateRange(transactions: Transaction[], start: string, end: string): Transaction[] {
  return transactions.filter((tx) => tx.date >= start && tx.date <= end);
}

export function filterByType(transactions: Transaction[], type: "expense" | "income"): Transaction[] {
  return transactions.filter((tx) => tx.type === type);
}

export function getTotalByType(transactions: Transaction[], type: "expense" | "income"): number {
  return filterByType(transactions, type).reduce((sum, tx) => sum + tx.amount, 0);
}

export function getNetBalance(transactions: Transaction[]): number {
  return getTotalByType(transactions, "income") - getTotalByType(transactions, "expense");
}

export function getCategoryBreakdown(transactions: Transaction[], categories: Category[], type: "expense" | "income" = "expense"): CategoryBreakdown[] {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const filtered = filterByType(transactions, type);
  const total = filtered.reduce((sum, tx) => sum + tx.amount, 0);

  const amounts = new Map<string, number>();
  for (const tx of filtered) {
    amounts.set(tx.categoryId, (amounts.get(tx.categoryId) ?? 0) + tx.amount);
  }

  return [...amounts.entries()]
    .map(([categoryId, amount]) => {
      const category = categoryMap.get(categoryId);
      return {
        categoryId,
        name: category?.name ?? "Sconosciuta",
        icon: category?.icon ?? "📦",
        color: category?.color ?? "#78716C",
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function getTopTransactions(transactions: Transaction[], limit = 5): Transaction[] {
  return [...transactions].sort((a, b) => b.amount - a.amount).slice(0, limit);
}
