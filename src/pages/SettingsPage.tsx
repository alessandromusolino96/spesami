import { Download } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useCategories, useTransactions } from "../hooks/useTransactions";
import { exportToCsv, exportToJson } from "../lib/export";

export function SettingsPage() {
  const { categories } = useCategories();
  const { transactions } = useTransactions();

  return (
    <div className="px-4 pb-6 pt-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Impostazioni</h1>
        <p className="text-sm text-stone-500">Backup e dati</p>
      </header>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Download className="h-5 w-5 text-brand-600" />
          <h2 className="text-lg font-semibold text-stone-800">Backup dati</h2>
        </div>
        <Card className="space-y-3">
          <p className="text-sm text-stone-500">I dati restano sul tuo telefono. Esporta periodicamente un backup per sicurezza.</p>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" className="w-full" onClick={() => exportToJson()}>
              Esporta JSON
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => exportToCsv(transactions, categories)}>
              Esporta CSV
            </Button>
          </div>
        </Card>
      </section>

      <footer className="mt-8 text-center text-xs text-stone-400">
        <p>Spesami · Le tue finanze, ogni sera</p>
        <p className="mt-1">Dati salvati localmente sul dispositivo</p>
      </footer>
    </div>
  );
}
