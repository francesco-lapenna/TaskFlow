import { Bell, Search, Plus, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '@/context/ThemeContext';

export function Topbar() {
  const navigate = useNavigate();
  const { isDark, toggle } = useThemeContext();

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800 sm:px-6">
      <div className="relative max-w-md flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          placeholder="Search projects, tasks…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-brand-500 dark:focus:bg-slate-700 dark:focus:ring-brand-900"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/projects?new=1')}
          className="btn-primary"
        >
          <Plus size={16} />
          New project
        </button>
        <button
          className="btn-ghost relative"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>
        <button
          className="btn-ghost"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggle}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          FL
        </div>
      </div>
    </header>
  );
}
