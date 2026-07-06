export type TransactionType = "expense" | "income";

export type CategoryType = "expense" | "income" | "both";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  sortOrder: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  label?: string;
  note?: string;
  createdAt: string;
}

export interface DaySummary {
  expenses: number;
  income: number;
  balance: number;
  count: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
}
