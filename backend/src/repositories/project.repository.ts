import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { DbDataSource } from '../datasources/db.datasource';
import { Project, ProjectRelations } from '../models/project.model';
import { Task } from '../models/task.model';
import { TaskRepository } from './task.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {
  public readonly tasks: HasManyRepositoryFactory<Task, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TaskRepository') taskRepositoryGetter: Getter<TaskRepository>,
  ) {
    super(Project, dataSource);
    this.tasks = this.createHasManyRepositoryFactoryFor('tasks', taskRepositoryGetter);
    this.registerInclusionResolver('tasks', this.tasks.inclusionResolver);
  }
}
