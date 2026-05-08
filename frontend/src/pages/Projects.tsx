import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Users, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';
import { ProjectForm } from '@/components/forms/ProjectForm';
import { createProject, listProjects, useApi } from '@/lib/api';
import type { ProjectStatus } from '@/types';

const statusTone: Record<ProjectStatus, 'blue' | 'amber' | 'green' | 'slate'> = {
  active: 'blue',
  on_hold: 'amber',
  completed: 'green',
  archived: 'slate',
};

export function Projects() {
  const { data: projects, error, loading, refetch } = useApi(listProjects);
  const [searchParams, setSearchParams] = useSearchParams();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setCreating(true);
    }
  }, [searchParams]);

  const closeModal = () => {
    setCreating(false);
    if (searchParams.get('new')) {
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const items = projects ?? [];

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle={
          loading
            ? 'Loading projects…'
            : `${items.length} project${items.length === 1 ? '' : 's'} across the team`
        }
        actions={
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="btn-primary"
          >
            <Plus size={16} />
            New project
          </button>
        }
      />

      {error && (
        <p className="mb-4 text-sm text-red-600">
          Failed to load projects: {error.message}
        </p>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
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

      <Modal open={creating} onClose={closeModal} title="New project">
        <ProjectForm
          onCancel={closeModal}
          onSubmit={async (project) => {
            await createProject(project);
            refetch();
            closeModal();
          }}
        />
      </Modal>
    </>
  );
}
