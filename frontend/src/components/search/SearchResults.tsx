import { FolderKanban, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import type { Project, Task, ProjectStatus, TaskPriority } from '@/types';

interface SearchResultsProps {
  query: string;
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  onSelect: () => void;
}

const projectStatusTone: Record<ProjectStatus, 'green' | 'amber' | 'slate'> = {
  active: 'green',
  on_hold: 'amber',
  completed: 'slate',
  archived: 'slate',
};

const priorityTone: Record<TaskPriority, 'slate' | 'amber' | 'red'> = {
  low: 'slate',
  medium: 'amber',
  high: 'red',
};

function SectionHeader({ label, icon: Icon }: { label: string; icon: typeof FolderKanban }) {
  return (
    <div className="flex items-center gap-1.5 border-t border-slate-100 px-3 py-1.5 first:border-t-0 dark:border-slate-700">
      <Icon size={12} className="text-slate-400" />
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </span>
    </div>
  );
}

export function SearchResults({ query, projects, tasks, loading, onSelect }: SearchResultsProps) {
  const navigate = useNavigate();
  const isEmpty = projects.length === 0 && tasks.length === 0;

  return (
    <div
      role="listbox"
      aria-label="Search results"
      className="absolute left-0 top-full z-50 mt-1 max-h-[420px] w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
    >
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      )}

      {!loading && isEmpty && (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          No results for &ldquo;{query}&rdquo;
        </p>
      )}

      {!loading && projects.length > 0 && (
        <section>
          <SectionHeader label="Projects" icon={FolderKanban} />
          {projects.map((project) => (
            <button
              key={project.id}
              role="option"
              aria-selected={false}
              type="button"
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50"
              onClick={() => {
                navigate('/projects');
                onSelect();
              }}
            >
              <FolderKanban size={15} className="shrink-0 text-brand-500" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {project.name}
              </span>
              <Badge tone={projectStatusTone[project.status]}>
                {project.status.replace('_', ' ')}
              </Badge>
            </button>
          ))}
        </section>
      )}

      {!loading && tasks.length > 0 && (
        <section>
          <SectionHeader label="Tasks" icon={CheckSquare} />
          {tasks.map((task) => (
            <button
              key={task.id}
              role="option"
              aria-selected={false}
              type="button"
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50"
              onClick={() => {
                navigate('/tasks');
                onSelect();
              }}
            >
              <CheckSquare size={15} className="shrink-0 text-slate-400" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {task.title}
              </span>
              <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
