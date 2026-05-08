import { Filter, FilterExcludingWhere, repository } from '@loopback/repository';
import { del, get, getModelSchemaRef, param, patch, post, put, requestBody } from '@loopback/rest';
import { Task } from '../models/task.model';
import { TaskRepository } from '../repositories/task.repository';

export class TaskController {
  constructor(@repository(TaskRepository) private tasks: TaskRepository) {}

  @post('/tasks', {
    responses: {
      '200': { description: 'Task created', content: { 'application/json': { schema: getModelSchemaRef(Task) } } },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, { title: 'NewTask', exclude: ['createdAt'] }),
        },
      },
    })
    task: Omit<Task, 'createdAt'>,
  ): Promise<Task> {
    return this.tasks.create(task);
  }

  @get('/tasks', {
    responses: {
      '200': {
        description: 'Array of Task',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Task) },
          },
        },
      },
    },
  })
  async find(@param.filter(Task) filter?: Filter<Task>): Promise<Task[]> {
    return this.tasks.find(filter);
  }

  @get('/tasks/{id}', {
    responses: {
      '200': { description: 'Task', content: { 'application/json': { schema: getModelSchemaRef(Task) } } },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Task, { exclude: 'where' }) filter?: FilterExcludingWhere<Task>,
  ): Promise<Task> {
    return this.tasks.findById(id, filter);
  }

  @patch('/tasks/{id}', { responses: { '204': { description: 'Task PATCH success' } } })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': { schema: getModelSchemaRef(Task, { partial: true }) },
      },
    })
    task: Partial<Task>,
  ): Promise<void> {
    await this.tasks.updateById(id, task);
  }

  @put('/tasks/{id}', { responses: { '204': { description: 'Task PUT success' } } })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() task: Task,
  ): Promise<void> {
    await this.tasks.replaceById(id, task);
  }

  @del('/tasks/{id}', { responses: { '204': { description: 'Task DELETE success' } } })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tasks.deleteById(id);
  }
}
