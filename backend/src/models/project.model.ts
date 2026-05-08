import { Entity, model, property } from '@loopback/repository';

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

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export type ProjectWithRelations = Project;
