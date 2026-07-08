import { useMemo, useState } from "react";
import { addMonths, startOfMonth, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "../components/ui/Card";
import { CategoryIcon } from "../components/ui/CategoryIcon";
import { TransactionItem } from "../components/ui/TransactionItem";
import { getCategoryMap, useCategories, useTransactions } from "../hooks/useTransactions";
import { filterByDateRange, getCategoryBreakdown, getNetBalance, getTopTransactions, getTotalByType } from "../lib/analytics";
import { canGoToNextMonth, capitalizeFirst, formatMonthLabel, getMonthRange } from "../lib/dates";
import { formatCurrency } from "../lib/format";

export function DashboardPage() {
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const categoryMap = getCategoryMap(categories);

  const [selectedMonth, setSelectedMonth] = useState(() => startOfMonth(new Date()));
  const monthRange = useMemo(() => getMonthRange(selectedMonth), [selectedMonth]);
  const canGoNext = canGoToNextMonth(selectedMonth);

  const monthTransactions = useMemo(() => filterByDateRange(transactions, monthRange.start, monthRange.end), [transactions, monthRange.start, monthRange.end]);

  const expenses = getTotalByType(monthTransactions, "expense");
  const income = getTotalByType(monthTransactions, "income");
  const balance = getNetBalance(monthTransactions);
  const breakdown = getCategoryBreakdown(monthTransactions, categories, "expense");
  const topExpenses = getTopTransactions(
    monthTransactions.filter((tx) => tx.type === "expense"),
    5,
  );

  const monthLabel = capitalizeFirst(formatMonthLabel(selectedMonth));
  const chartData = breakdown.slice(0, 6);

  return (
    <div className="px-4 pb-6 pt-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Analisi</h1>

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedMonth((current) => subMonths(current, 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-white text-stone-600 transition hover:border-brand-300 hover:text-brand-700"
            aria-label="Mese precedente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <p className="text-center text-sm font-semibold text-stone-700">{monthLabel}</p>

          <button
            type="button"
            onClick={() => canGoNext && setSelectedMonth((current) => addMonths(current, 1))}
            disabled={!canGoNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-white text-stone-600 transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Mese successivo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card className="!p-4">
          <p className="text-xs font-medium text-stone-500">Entrate</p>
          <p className="mt-1 text-xl font-bold text-income-text">{formatCurrency(income)}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium text-stone-500">Uscite</p>
          <p className="mt-1 text-xl font-bold text-expense-text">{formatCurrency(expenses)}</p>
        </Card>
      </div>

      <Card className="mb-4 !p-4">
        <p className="text-sm font-medium text-stone-500">Saldo netto del mese</p>
        <p className={`mt-1 text-3xl font-bold ${balance >= 0 ? "text-income-text" : "text-expense-text"}`}>{formatCurrency(balance)}</p>
      </Card>

      <Card className="mb-4">
        <h2 className="mb-4 text-lg font-semibold text-stone-800">Spese per categoria</h2>
        {chartData.length > 0 ? (
          <>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="amount" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {chartData.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ borderRadius: "0.75rem", border: "1px solid #E5EBE8" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {breakdown.map((item) => (
                <div key={item.categoryId} className="flex items-center gap-3">
                  <CategoryIcon icon={item.icon} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-stone-700">{item.name}</span>
                      <span className="text-sm font-semibold text-stone-900">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-10 text-right text-xs text-stone-400">{item.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-stone-500">Nessuna spesa registrata in questo mese.</p>
        )}
      </Card>

      {topExpenses.length > 0 && (
        <Card>
          <h2 className="mb-2 text-lg font-semibold text-stone-800">Spese più alte</h2>
          <div className="divide-y divide-surface-border">
            {topExpenses.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} category={categoryMap.get(tx.categoryId)} showDate />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
