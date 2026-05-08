import { useState, type FormEvent } from 'react';
import { toIsoDateTime, type CreateProjectPayload } from '@/lib/api';
import type { ProjectStatus } from '@/types';

interface ProjectFormProps {
  onSubmit: (project: CreateProjectPayload) => Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim().length > 0 && !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    const payload: CreateProjectPayload = {
      id: crypto.randomUUID(),
      name: name.trim(),
      status,
      progress: 0,
      membersCount: 0,
    };
    const trimmedDescription = description.trim();
    if (trimmedDescription) payload.description = trimmedDescription;
    const isoDue = toIsoDateTime(dueDate);
    if (isoDue) payload.dueDate = isoDue;

    try {
      await onSubmit(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="project-name" className="label">Name</label>
        <input
          id="project-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Website redesign"
          required
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="project-description" className="label">Description</label>
        <textarea
          id="project-description"
          className="input min-h-[72px] resize-y"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="project-status" className="label">Status</label>
          <select
            id="project-status"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            <option value="active">Active</option>
            <option value="on_hold">On hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label htmlFor="project-due" className="label">Due date</label>
          <input
            id="project-due"
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
          {submitting ? 'Creating…' : 'Create project'}
        </button>
      </div>
    </form>
  );
}
