import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/database";
import { generateId } from "../lib/format";
import type { Category, DaySummary, Transaction, TransactionType } from "../types";

export function useTransactions() {
  const transactions = useLiveQuery(() => db.transactions.orderBy("date").reverse().toArray(), []);

  return { transactions: transactions ?? [] };
}

export function useTransactionsByDate(date: string) {
  const transactions = useLiveQuery(async () => {
    const items = await db.transactions.where("date").equals(date).sortBy("createdAt");
    return items.reverse();
  }, [date]);

  return { transactions: transactions ?? [] };
}

export function useCategories() {
  const categories = useLiveQuery(() => db.categories.orderBy("sortOrder").toArray(), []);

  return { categories: categories ?? [] };
}

export function useCategoriesByType(type: TransactionType) {
  const categories = useLiveQuery(() => db.categories.filter((c) => c.type === type || c.type === "both").sortBy("sortOrder"), [type]);

  return { categories: categories ?? [] };
}

export function getCategoryMap(categories: Category[]): Map<string, Category> {
  return new Map(categories.map((c) => [c.id, c]));
}

export function summarizeTransactions(transactions: Transaction[]): DaySummary {
  return transactions.reduce<DaySummary>(
    (acc, tx) => {
      if (tx.type === "expense") {
        acc.expenses += tx.amount;
      } else {
        acc.income += tx.amount;
      }
      acc.count += 1;
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { expenses: 0, income: 0, balance: 0, count: 0 },
  );
}

export async function addTransaction(data: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> {
  const transaction: Transaction = {
    ...data,
    id: generateId("tx"),
    createdAt: new Date().toISOString(),
  };
  await db.transactions.add(transaction);
  return transaction;
}

export async function updateTransaction(id: string, data: Partial<Omit<Transaction, "id" | "createdAt">>): Promise<void> {
  await db.transactions.update(id, data);
}

export async function deleteTransaction(id: string): Promise<void> {
  await db.transactions.delete(id);
}
