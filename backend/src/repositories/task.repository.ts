import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { DbDataSource } from '../datasources/db.datasource';
import { Task } from '../models/task.model';

export class TaskRepository extends DefaultCrudRepository<Task, typeof Task.prototype.id> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Task, dataSource);
  }
}
