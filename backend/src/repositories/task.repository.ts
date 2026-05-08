import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
import { DbDataSource } from '../datasources/db.datasource';
import { Project } from '../models/project.model';
import { Task, TaskRelations } from '../models/task.model';
import { ProjectRepository } from './project.repository';

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.id,
  TaskRelations
> {
  public readonly project: BelongsToAccessor<Project, typeof Task.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProjectRepository') projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(Task, dataSource);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
  }
}
