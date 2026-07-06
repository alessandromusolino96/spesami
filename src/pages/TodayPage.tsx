import { useState } from "react";
import { Link } from "react-router-dom";
import { addDays, startOfDay, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { TransactionItem } from "../components/ui/TransactionItem";
import { getCategoryMap, summarizeTransactions, useCategories, useTransactionsByDate } from "../hooks/useTransactions";
import { formatCurrency, toDateInputValue } from "../lib/format";
import { canGoToNextDay, capitalizeFirst, formatDayLabel, isToday } from "../lib/dates";

export function TodayPage() {
  const [selectedDay, setSelectedDay] = useState(() => startOfDay(new Date()));
  const selectedDateISO = toDateInputValue(selectedDay);
  const viewingToday = isToday(selectedDay);
  const canGoNext = canGoToNextDay(selectedDay);

  const { transactions } = useTransactionsByDate(selectedDateISO);
  const { categories } = useCategories();
  const categoryMap = getCategoryMap(categories);
  const summary = summarizeTransactions(transactions);

  const dateLabel = capitalizeFirst(formatDayLabel(selectedDay));
  const sectionTitle = viewingToday
    ? `Oggi · ${summary.count} ${summary.count === 1 ? "movimento" : "movimenti"}`
    : `${dateLabel} · ${summary.count} ${summary.count === 1 ? "movimento" : "movimenti"}`;

  return (
    <div className="px-4 pb-6 pt-4">
      <header className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-stone-900">Spesami</h1>
          {!viewingToday && (
            <button
              type="button"
              onClick={() => setSelectedDay(startOfDay(new Date()))}
              className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              Torna a oggi
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedDay((current) => subDays(current, 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-white text-stone-600 transition hover:border-brand-300 hover:text-brand-700"
            aria-label="Giorno precedente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <p className="text-center text-sm font-semibold text-stone-700">{dateLabel}</p>

          <button
            type="button"
            onClick={() => canGoNext && setSelectedDay((current) => addDays(current, 1))}
            disabled={!canGoNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-white text-stone-600 transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Giorno successivo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="!p-3 text-center">
          <div className="mb-1 flex items-center justify-center gap-1 text-expense-text">
            <TrendingDown className="h-4 w-4" />
            <span className="text-xs font-medium">Uscite</span>
          </div>
          <p className="text-lg font-bold text-stone-900">{formatCurrency(summary.expenses)}</p>
        </Card>
        <Card className="!p-3 text-center">
          <div className="mb-1 flex items-center justify-center gap-1 text-income-text">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Entrate</span>
          </div>
          <p className="text-lg font-bold text-stone-900">{formatCurrency(summary.income)}</p>
        </Card>
        <Card className="!p-3 text-center">
          <p className="mb-1 text-xs font-medium text-stone-500">Saldo</p>
          <p className={`text-lg font-bold ${summary.balance >= 0 ? "text-income-text" : "text-expense-text"}`}>
            {formatCurrency(summary.balance)}
          </p>
        </Card>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-stone-800">{sectionTitle}</h2>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <EmptyState
            icon="📝"
            title={viewingToday ? "Nessun movimento oggi" : "Nessun movimento"}
            description={
              viewingToday
                ? "Inserisci qui le spese e le entrate di oggi."
                : "Non ci sono movimenti registrati per questo giorno."
            }
            action={
              <Link to="/aggiungi" state={{ date: selectedDateISO }}>
                <Button>{viewingToday ? "Aggiungi il primo movimento" : "Aggiungi movimento"}</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <Card className="divide-y divide-surface-border">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} category={categoryMap.get(tx.categoryId)} />
          ))}
        </Card>
      )}
    </div>
  );
}
