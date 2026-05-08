import { Entity, hasMany, model, property } from '@loopback/repository';
import { Task } from './task.model';

@model({ settings: { strict: true } })
export class Project extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({ type: 'string', required: true })
  name: string;

  @property({ type: 'string' })
  description?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: { enum: ['active', 'on_hold', 'completed', 'archived'] },
    default: 'active',
  })
  status: 'active' | 'on_hold' | 'completed' | 'archived';

  @property({ type: 'number', default: 0 })
  progress: number;

  @property({ type: 'number', default: 0 })
  membersCount: number;

  @property({ type: 'date' })
  dueDate?: Date;

  @property({ type: 'date', defaultFn: 'now' })
  createdAt?: Date;

  @hasMany(() => Task, { keyTo: 'projectId' })
  tasks?: Task[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  tasks?: Task[];
}

export type ProjectWithRelations = Project & ProjectRelations;
