import { useState, type FormEvent } from 'react';
import { toIsoDateTime, type CreateTaskPayload } from '@/lib/api';
import type { Project, TaskPriority, TaskStatus } from '@/types';

interface TaskFormProps {
  projects: Project[];
  defaultProjectId?: string;
  onSubmit: (task: CreateTaskPayload) => Promise<void>;
  onCancel: () => void;
}

export function TaskForm({ projects, defaultProjectId, onSubmit, onCancel }: TaskFormProps) {
  const [projectId, setProjectId] = useState(defaultProjectId ?? projects[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = title.trim().length > 0 && projectId.length > 0 && !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    const payload: CreateTaskPayload = {
      id: crypto.randomUUID(),
      projectId,
      title: title.trim(),
      status,
      priority,
    };
    const trimmedAssignee = assignee.trim();
    if (trimmedAssignee) payload.assignee = trimmedAssignee;
    const isoDue = toIsoDateTime(dueDate);
    if (isoDue) payload.dueDate = isoDue;

    try {
      await onSubmit(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          You need at least one project before you can create a task.
        </p>
        <div className="flex justify-end">
          <button type="button" onClick={onCancel} className="btn-ghost">Close</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="task-project" className="label">Project</label>
        <select
          id="task-project"
          className="input"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="task-title" className="label">Title</label>
        <input
          id="task-title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Design new landing hero"
          required
          autoFocus
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="task-status" className="label">Status</label>
          <select
            id="task-status"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="review">In review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label htmlFor="task-priority" className="label">Priority</label>
          <select
            id="task-priority"
            className="input"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="task-assignee" className="label">Assignee</label>
          <input
            id="task-assignee"
            className="input"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="task-due" className="label">Due date</label>
          <input
            id="task-due"
            type="date"
            className="input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button type="submit" disabled={!canSubmit} className="btn-primary">
          {submitting ? 'Creating…' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
