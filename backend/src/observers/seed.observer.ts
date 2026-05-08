import { lifeCycleObserver, LifeCycleObserver, CoreBindings, inject } from '@loopback/core';
import { TaskFlowApplication } from '../application';
import { ProjectRepository } from '../repositories/project.repository';
import { TaskRepository } from '../repositories/task.repository';

/**
 * Populates the in-memory datasource with a few rows on boot so the
 * frontend has something to render before any real persistence is added.
 * No-ops once the data is already there (e.g. on hot reload) and is safe
 * to leave on for MySQL too — it just inserts seed rows once.
 */
@lifeCycleObserver('')
export class SeedObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: TaskFlowApplication,
  ) {}

  async start(): Promise<void> {
    const projects = await this.app.getRepository(ProjectRepository);
    const tasks = await this.app.getRepository(TaskRepository);

    if ((await projects.count()).count > 0) return;

    await projects.createAll([
      {
        id: 'p-1',
        name: 'Website redesign',
        description: 'Refresh the marketing site with the new brand system.',
        status: 'active',
        progress: 62,
        membersCount: 5,
      },
      {
        id: 'p-2',
        name: 'Mobile app v2',
        description: 'Rebuild the native client on the new architecture.',
        status: 'active',
        progress: 28,
        membersCount: 8,
      },
    ]);

    await tasks.createAll([
      { id: 't-1', projectId: 'p-1', title: 'Design new landing hero', status: 'in_progress', priority: 'high', assignee: 'Aria Nakamura' },
      { id: 't-2', projectId: 'p-1', title: 'Migrate blog to MDX', status: 'todo', priority: 'medium', assignee: 'Leo Marin' },
      { id: 't-3', projectId: 'p-2', title: 'Set up new CI matrix', status: 'review', priority: 'high', assignee: 'Priya Shah' },
    ]);
  }
}
