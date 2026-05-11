import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, delta, icon: Icon }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
          {delta && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{delta}</p>}
        </div>
        <div className="rounded-lg bg-brand-50 p-2 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
