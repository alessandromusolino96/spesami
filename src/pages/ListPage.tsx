import { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { TransactionItem } from "../components/ui/TransactionItem";
import { deleteTransaction, getCategoryMap, useCategories, useTransactions } from "../hooks/useTransactions";
import type { TransactionType } from "../types";

export function ListPage() {
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const categoryMap = getCategoryMap(categories);

  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (categoryFilter !== "all" && tx.categoryId !== categoryFilter) return false;
      return true;
    });
  }, [transactions, typeFilter, categoryFilter]);

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof filtered>();
    for (const tx of filtered) {
      const list = groups.get(tx.date) ?? [];
      list.push(tx);
      groups.set(tx.date, list);
    }
    return [...groups.entries()];
  }, [filtered]);

  async function handleDelete(id: string) {
    if (window.confirm("Eliminare questa transazione?")) {
      await deleteTransaction(id);
    }
  }

  return (
    <div className="px-4 pb-6 pt-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Storico</h1>
        <p className="text-sm text-stone-500">Tutti i movimenti registrati</p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "expense", "income"] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setTypeFilter(filter)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${typeFilter === filter ? "bg-brand-600 text-white" : "bg-white text-stone-600 border border-surface-border"}`}
          >
            {filter === "all" ? "Tutti" : filter === "expense" ? "Spese" : "Entrate"}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400"
        >
          <option value="all">Tutte le categorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon="📋" title="Nessun movimento" description="I movimenti che inserisci appariranno qui." />
        </Card>
      ) : (
        <div className="space-y-4">
          {grouped.map(([date, items]) => (
            <Card key={date}>
              <h3 className="mb-2 text-sm font-semibold text-stone-500">
                {new Intl.DateTimeFormat("it-IT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }).format(new Date(date))}
              </h3>
              <div className="divide-y divide-surface-border">
                {items.map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} category={categoryMap.get(tx.categoryId)} onDelete={handleDelete} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
