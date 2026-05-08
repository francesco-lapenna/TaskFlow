import { Filter, FilterExcludingWhere, repository } from '@loopback/repository';
import { del, get, getModelSchemaRef, param, patch, post, put, requestBody } from '@loopback/rest';
import { Project } from '../models/project.model';
import { ProjectRepository } from '../repositories/project.repository';

export class ProjectController {
  constructor(@repository(ProjectRepository) private projects: ProjectRepository) {}

  @post('/projects', {
    responses: {
      '200': { description: 'Project created', content: { 'application/json': { schema: getModelSchemaRef(Project) } } },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, { title: 'NewProject', exclude: ['createdAt'] }),
        },
      },
    })
    project: Omit<Project, 'createdAt'>,
  ): Promise<Project> {
    return this.projects.create(project);
  }

  @get('/projects', {
    responses: {
      '200': {
        description: 'Array of Project',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Project) },
          },
        },
      },
    },
  })
  async find(@param.filter(Project) filter?: Filter<Project>): Promise<Project[]> {
    return this.projects.find(filter);
  }

  @get('/projects/{id}', {
    responses: {
      '200': { description: 'Project', content: { 'application/json': { schema: getModelSchemaRef(Project) } } },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Project, { exclude: 'where' }) filter?: FilterExcludingWhere<Project>,
  ): Promise<Project> {
    return this.projects.findById(id, filter);
  }

  @patch('/projects/{id}', { responses: { '204': { description: 'Project PATCH success' } } })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': { schema: getModelSchemaRef(Project, { partial: true }) },
      },
    })
    project: Partial<Project>,
  ): Promise<void> {
    await this.projects.updateById(id, project);
  }

  @put('/projects/{id}', { responses: { '204': { description: 'Project PUT success' } } })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() project: Project,
  ): Promise<void> {
    await this.projects.replaceById(id, project);
  }

  @del('/projects/{id}', { responses: { '204': { description: 'Project DELETE success' } } })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.projects.deleteById(id);
  }
}
