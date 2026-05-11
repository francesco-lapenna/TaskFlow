import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/forms/TaskForm';
import { createTask, listProjects, listTasks, useApi } from '@/lib/api';
import type { Project, TaskPriority, TaskStatus } from '@/types';

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
  const tasks = useApi(listTasks);
  const projects = useApi(listProjects);
  const [creating, setCreating] = useState(false);

  const loading = tasks.loading || projects.loading;
  const error = tasks.error ?? projects.error;

  const items = tasks.data ?? [];
  const projectList = projects.data ?? [];
  const projectsById = new Map<string, Project>(projectList.map((p) => [p.id, p]));
  const projectName = (id: string) => projectsById.get(id)?.name ?? '—';

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle={
          loading
            ? 'Loading tasks…'
            : `${items.length} task${items.length === 1 ? '' : 's'} across all projects`
        }
        actions={
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="btn-primary"
            disabled={loading}
          >
            <Plus size={16} />
            New task
          </button>
        }
      />

      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">
          Failed to load tasks: {error.message}
        </p>
      )}

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Task</th>
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Assignee</th>
                <th className="px-5 py-3 font-medium">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {items.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">{t.title}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{projectName(t.projectId)}</td>
                  <td className="px-5 py-3">
                    <Badge tone={statusTone[t.status]}>{statusLabel[t.status]}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={priorityTone[t.priority]}>{t.priority}</Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{t.assignee ?? '—'}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{t.dueDate ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={creating} onClose={() => setCreating(false)} title="New task">
        <TaskForm
          projects={projectList}
          onCancel={() => setCreating(false)}
          onSubmit={async (task) => {
            await createTask(task);
            tasks.refetch();
            setCreating(false);
          }}
        />
      </Modal>
    </>
  );
}
