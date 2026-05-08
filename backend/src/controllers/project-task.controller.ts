import { Filter, repository } from '@loopback/repository';
import { get, getModelSchemaRef, param, post, requestBody } from '@loopback/rest';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { ProjectRepository } from '../repositories/project.repository';

export class ProjectTaskController {
  constructor(@repository(ProjectRepository) private projects: ProjectRepository) {}

  @get('/projects/{id}/tasks', {
    responses: {
      '200': {
        description: 'Array of Task belonging to the Project',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Task) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: typeof Project.prototype.id,
    @param.query.object('filter') filter?: Filter<Task>,
  ): Promise<Task[]> {
    return this.projects.tasks(id).find(filter);
  }

  @post('/projects/{id}/tasks', {
    responses: {
      '200': {
        description: 'Task created under Project',
        content: { 'application/json': { schema: getModelSchemaRef(Task) } },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {
            title: 'NewTaskInProject',
            exclude: ['createdAt', 'projectId'],
            optional: ['projectId'],
          }),
        },
      },
    })
    task: Omit<Task, 'createdAt' | 'projectId'>,
  ): Promise<Task> {
    return this.projects.tasks(id).create(task);
  }
}
