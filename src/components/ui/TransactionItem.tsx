import { useEffect, useState } from "react";
import { Delete } from "lucide-react";
import type { Category, Transaction } from "../../types";
import { formatCurrency, formatDateShort } from "../../lib/format";
import { CategoryIcon } from "./CategoryIcon";

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  showDate?: boolean;
  onDelete?: (id: string) => void;
}

export function TransactionItem({ transaction, category, showDate = false, onDelete }: TransactionItemProps) {
  const isExpense = transaction.type === "expense";

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg" style={{ backgroundColor: `${category?.color ?? "#78716C"}20` }}>
        <CategoryIcon icon={category?.icon ?? "📦"} size="md" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-stone-800">{transaction.label || category?.name || "Senza categoria"}</p>
        </div>
        <p className="truncate text-sm text-stone-500">
          {category?.name}
          {showDate && ` · ${formatDateShort(transaction.date)}`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <p className={`whitespace-nowrap font-semibold ${isExpense ? "text-expense-text" : "text-income-text"}`}>
          {isExpense ? "−" : "+"}
          {formatCurrency(transaction.amount)}
        </p>
        {onDelete && (
          <button type="button" onClick={() => onDelete(transaction.id)} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500" aria-label="Elimina transazione">
            <Delete className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export function AmountInput({ value, onChange, autoFocus = false }: AmountInputProps) {
  const [focused, setFocused] = useState(autoFocus);

  useEffect(() => {
    if (autoFocus) setFocused(true);
  }, [autoFocus]);

  return (
    <div className="text-center">
      <label className="mb-2 block text-sm font-medium text-stone-500">Importo</label>
      <div className="relative inline-flex items-baseline gap-1">
        <span className="text-2xl font-medium text-stone-400">€</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          value={value}
          autoFocus={focused}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-[220px] border-none bg-transparent text-center text-5xl font-bold text-stone-900 outline-none placeholder:text-stone-300"
        />
      </div>
    </div>
  );
}

interface CategoryPickerProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryPicker({ categories, selectedId, onSelect }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {categories.map((category) => {
        const selected = category.id === selectedId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition ${
              selected ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200" : "border-surface-border bg-white hover:border-brand-200"
            }`}
          >
            <CategoryIcon icon={category.icon} size="lg" />
            <span className="line-clamp-2 text-center text-xs font-medium text-stone-700">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
