import type { Category, Transaction } from "../types";
import { db } from "../db/database";

export async function exportToJson(): Promise<void> {
  const [transactions, categories] = await Promise.all([db.transactions.toArray(), db.categories.toArray()]);

  const payload = {
    exportedAt: new Date().toISOString(),
    app: "Spesami",
    version: 1,
    data: { transactions, categories },
  };

  downloadFile(JSON.stringify(payload, null, 2), `spesami-backup-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
}

export async function exportToCsv(transactions: Transaction[], categories: Category[]): Promise<void> {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const header = "data,tipo,importo,categoria,etichetta,nota";
  const rows = transactions
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((tx) => {
      const fields = [tx.date, tx.type === "expense" ? "Spesa" : "Entrata", tx.amount.toFixed(2).replace(".", ","), categoryMap.get(tx.categoryId) ?? "", tx.label ?? "", tx.note ?? ""];
      return fields.map(escapeCsvField).join(",");
    });

  downloadFile([header, ...rows].join("\n"), `spesami-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8");
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
