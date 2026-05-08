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
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          {delta && <p className="mt-1 text-xs text-emerald-600">{delta}</p>}
        </div>
        <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
