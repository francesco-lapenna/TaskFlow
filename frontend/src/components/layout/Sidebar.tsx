import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, ListChecks, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
          <Sparkles size={16} />
        </div>
        <span className="text-base font-semibold text-slate-900">TaskFlow</span>
      </div>

      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-4 text-xs text-slate-500">
        v0.1.0 · scaffold
      </div>
    </aside>
  );
}
