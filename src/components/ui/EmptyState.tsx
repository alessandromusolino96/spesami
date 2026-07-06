import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-stone-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
