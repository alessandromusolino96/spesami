import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, CalendarDays, Home, Plus, Settings } from "lucide-react";

const leftNavItems = [
  { to: "/", label: "Oggi", icon: Home, end: true },
  { to: "/lista", label: "Lista", icon: CalendarDays },
];

const rightNavItems = [
  { to: "/dashboard", label: "Analisi", icon: BarChart3 },
  { to: "/impostazioni", label: "Altro", icon: Settings },
];

function NavTab({ to, label, icon: Icon, end }: { to: string; label: string; icon: typeof Home; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition ${isActive ? "text-brand-700" : "text-stone-400 hover:text-stone-600"}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-surface-muted">
      <main className="flex-1 overflow-y-auto pb-28 safe-top">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-surface-border bg-white/95 shadow-nav backdrop-blur safe-bottom">
        <div className="mx-auto flex max-w-lg items-end justify-between px-4 pb-1 pt-2">
          <div className="flex flex-1 justify-around">
            {leftNavItems.map((item) => (
              <NavTab key={item.to} {...item} />
            ))}
          </div>

          <NavLink
            to="/aggiungi"
            className={({ isActive }) =>
              `relative -mt-7 mx-2 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-fab transition active:scale-95 hover:bg-brand-700 ${
                isActive ? "ring-4 ring-brand-200" : ""
              }`
            }
            aria-label="Aggiungi movimento"
          >
            <Plus className="h-8 w-8" strokeWidth={2.5} />
          </NavLink>

          <div className="flex flex-1 justify-around">
            {rightNavItems.map((item) => (
              <NavTab key={item.to} {...item} />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
