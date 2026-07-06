import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { seedCategoriesIfEmpty } from "./db/seed";
import { AddPage } from "./pages/AddPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ListPage } from "./pages/ListPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TodayPage } from "./pages/TodayPage";

function AppRoutes() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      await seedCategoriesIfEmpty();
      setReady(true);
    }
    init();
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-muted">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-3xl text-white">€</div>
          <p className="font-semibold text-stone-800">Spesami</p>
          <p className="mt-1 text-sm text-stone-500">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<TodayPage />} />
        <Route path="aggiungi" element={<AddPage />} />
        <Route path="lista" element={<ListPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="impostazioni" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
