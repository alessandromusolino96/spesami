import Dexie, { type EntityTable } from "dexie";
import type { Category, Transaction } from "../types";

class SpesamiDatabase extends Dexie {
  transactions!: EntityTable<Transaction, "id">;
  categories!: EntityTable<Category, "id">;

  constructor() {
    super("spesami");

    this.version(1).stores({
      transactions: "id, type, categoryId, date, recurrenceId, createdAt",
      categories: "id, type, sortOrder",
      recurrences: "id, type, categoryId, active",
    });

    this.version(2).stores({
      transactions: "id, type, categoryId, date, createdAt",
      categories: "id, type, sortOrder",
    });
  }
}

export const db = new SpesamiDatabase();
