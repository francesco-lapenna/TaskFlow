import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockProjects, mockTasks } from '@/data/mock';
import type { TaskPriority, TaskStatus } from '@/types';

const statusLabel: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  review: 'In review',
  done: 'Done',
};

const statusTone: Record<TaskStatus, 'slate' | 'blue' | 'violet' | 'green'> = {
  todo: 'slate',
  in_progress: 'blue',
  review: 'violet',
  done: 'green',
};

const priorityTone: Record<TaskPriority, 'slate' | 'amber' | 'red'> = {
  low: 'slate',
  medium: 'amber',
  high: 'red',
};

export function Tasks() {
  const projectName = (id: string) => mockProjects.find((p) => p.id === id)?.name ?? '—';

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle={`${mockTasks.length} tasks across all projects`}
        actions={
          <button className="btn-primary">
            <Plus size={16} />
            New task
          </button>
        }
      />

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Task</th>
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Assignee</th>
                <th className="px-5 py-3 font-medium">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-900">{t.title}</td>
                  <td className="px-5 py-3 text-slate-600">{projectName(t.projectId)}</td>
                  <td className="px-5 py-3">
                    <Badge tone={statusTone[t.status]}>{statusLabel[t.status]}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={priorityTone[t.priority]}>{t.priority}</Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{t.assignee ?? '—'}</td>
                  <td className="px-5 py-3 text-slate-600">{t.dueDate ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
