import { CheckCircle2, FolderKanban, ListChecks, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockProjects, mockTasks } from '@/data/mock';

const statusTone = {
  active: 'blue',
  on_hold: 'amber',
  completed: 'green',
  archived: 'slate',
} as const;

export function Dashboard() {
  const activeProjects = mockProjects.filter((p) => p.status === 'active').length;
  const openTasks = mockTasks.filter((t) => t.status !== 'done').length;
  const completedTasks = mockTasks.filter((t) => t.status === 'done').length;
  const teamSize = new Set(mockTasks.map((t) => t.assignee).filter(Boolean)).size;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="A snapshot of what's moving today." />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value={activeProjects} icon={FolderKanban} delta="+1 this week" />
        <StatCard label="Open tasks" value={openTasks} icon={ListChecks} />
        <StatCard label="Completed" value={completedTasks} icon={CheckCircle2} delta="+3 this week" />
        <StatCard label="Teammates" value={teamSize} icon={Users} />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Recent projects" />
          <ul className="divide-y divide-slate-100">
            {mockProjects.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-slate-900">{p.name}</p>
                    <Badge tone={statusTone[p.status]}>{p.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">{p.description}</p>
                </div>
                <div className="hidden w-40 sm:block">
                  <ProgressBar value={p.progress} />
                  <p className="mt-1 text-right text-xs text-slate-500">{p.progress}%</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Up next" />
          <ul className="space-y-3">
            {mockTasks
              .filter((t) => t.status !== 'done')
              .slice(0, 5)
              .map((t) => (
                <li key={t.id} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-800">{t.title}</p>
                    <p className="text-xs text-slate-500">
                      {t.assignee ?? 'Unassigned'}
                      {t.dueDate ? ` · due ${t.dueDate}` : ''}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </Card>
      </section>
    </>
  );
}
