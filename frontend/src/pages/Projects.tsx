import { Plus, Users, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockProjects } from '@/data/mock';
import type { ProjectStatus } from '@/types';

const statusTone: Record<ProjectStatus, 'blue' | 'amber' | 'green' | 'slate'> = {
  active: 'blue',
  on_hold: 'amber',
  completed: 'green',
  archived: 'slate',
};

export function Projects() {
  return (
    <>
      <PageHeader
        title="Projects"
        subtitle={`${mockProjects.length} projects across the team`}
        actions={
          <button className="btn-primary">
            <Plus size={16} />
            New project
          </button>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockProjects.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900">{p.name}</h3>
              <Badge tone={statusTone[p.status]}>{p.status.replace('_', ' ')}</Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">{p.description}</p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span className="font-medium text-slate-700">{p.progress}%</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar value={p.progress} />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Users size={14} />
                {p.membersCount} members
              </span>
              {p.dueDate && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  {p.dueDate}
                </span>
              )}
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}
