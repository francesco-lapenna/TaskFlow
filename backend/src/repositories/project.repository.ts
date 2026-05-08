import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { DbDataSource } from '../datasources/db.datasource';
import { Project } from '../models/project.model';

export class ProjectRepository extends DefaultCrudRepository<Project, typeof Project.prototype.id> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Project, dataSource);
  }
}
