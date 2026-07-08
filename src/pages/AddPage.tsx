import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { AmountInput, CategoryPicker } from "../components/ui/TransactionItem";
import { addTransaction, useCategoriesByType } from "../hooks/useTransactions";
import { parseAmountInput, toDateInputValue } from "../lib/format";
import type { TransactionType } from "../types";

export function AddPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDate = typeof location.state === "object" && location.state !== null && "date" in location.state && typeof location.state.date === "string" ? location.state.date : toDateInputValue();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string>();
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(initialDate);
  const [saving, setSaving] = useState(false);
  const [addAnother, setAddAnother] = useState(false);

  const { categories } = useCategoriesByType(type);

  const parsedAmount = parseAmountInput(amount);
  const canSave = parsedAmount > 0 && categoryId;

  async function handleSave(stayOnPage: boolean) {
    if (!canSave || !categoryId) return;

    setSaving(true);
    try {
      await addTransaction({
        type,
        amount: parsedAmount,
        categoryId,
        date,
        label: label.trim() || undefined,
        note: note.trim() || undefined,
      });

      if (stayOnPage) {
        setAmount("");
        setLabel("");
        setNote("");
        setAddAnother(true);
      } else {
        navigate("/");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 pb-6 pt-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Nuovo movimento</h1>
        <p className="text-sm text-stone-500">Inserisci spese o entrate di oggi</p>
      </header>

      <Card className="mb-4">
        <div className="mb-6 flex rounded-xl bg-stone-100 p-1">
          {(["expense", "income"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setType(option);
                setCategoryId(undefined);
              }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                type === option ? (option === "expense" ? "bg-white text-expense-text shadow-sm" : "bg-white text-income-text shadow-sm") : "text-stone-500"
              }`}
            >
              {option === "expense" ? "Spesa" : "Entrata"}
            </button>
          ))}
        </div>

        <AmountInput value={amount} onChange={setAmount} autoFocus />
      </Card>

      <section className="mb-4">
        <h2 className="mb-3 text-sm font-semibold text-stone-700">Categoria</h2>
        <CategoryPicker categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
      </section>

      <Card className="mb-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-600">
            Etichetta <span className="font-normal text-stone-400">(opzionale)</span>
          </label>
          <input
            type="text"
            placeholder="es. Netflix, Esselunga..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-xl border border-surface-border px-3 py-2.5 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-600">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-surface-border px-3 py-2.5 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-600">
            Nota <span className="font-normal text-stone-400">(opzionale)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Note aggiuntive..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full resize-none rounded-xl border border-surface-border px-3 py-2.5 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <Button size="lg" className="w-full" disabled={!canSave || saving} onClick={() => handleSave(false)}>
          Salva
        </Button>
        <Button size="lg" variant="secondary" className="w-full" disabled={!canSave || saving} onClick={() => handleSave(true)}>
          <ArrowLeftRight className="h-4 w-4" />
          Salva e aggiungi un&apos;altra
        </Button>
      </div>

      {addAnother && <p className="mt-3 text-center text-sm text-brand-700">Salvato! Inserisci il prossimo movimento.</p>}
    </div>
  );
}
