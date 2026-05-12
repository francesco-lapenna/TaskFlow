import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Plus, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '@/context/ThemeContext';
import { searchProjects, searchTasks } from '@/lib/api';
import { scoreResult } from '@/lib/searchScore';
import { SearchResults } from '@/components/search/SearchResults';
import type { Project, Task } from '@/types';

export function Topbar() {
  const navigate = useNavigate();
  const { isDark, toggle } = useThemeContext();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ projects: Project[]; tasks: Task[] }>({
    projects: [],
    tasks: [],
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setOpen(false);
      setResults({ projects: [], tasks: [] });
      return;
    }
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      setOpen(true);
      try {
        const [projects, tasks] = await Promise.all([
          searchProjects(trimmed),
          searchTasks(trimmed),
        ]);
        const sortAndCap = <T extends Project | Task>(items: T[], key: keyof T) =>
          items
            .map((i) => ({ ...i, _s: scoreResult(String(i[key]), trimmed) }))
            .sort((a, b) => b._s - a._s)
            .slice(0, 5);
        setResults({
          projects: sortAndCap(projects, 'name'),
          tasks: sortAndCap(tasks, 'title'),
        });
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800 sm:px-6">
      <div className="relative max-w-md flex-1" ref={containerRef}>
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) setOpen(true);
          }}
          placeholder="Search projects, tasks…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-brand-500 dark:focus:bg-slate-700 dark:focus:ring-brand-900"
          aria-label="Search projects and tasks"
          aria-expanded={open}
          aria-haspopup="listbox"
          autoComplete="off"
        />
        {open && (
          <SearchResults
            query={query.trim()}
            projects={results.projects}
            tasks={results.tasks}
            loading={loading}
            onSelect={handleSelect}
          />
        )}
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
