import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: true } })
export class Task extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({ type: 'string', required: true })
  projectId: string;

  @property({ type: 'string', required: true })
  title: string;

  @property({ type: 'string' })
  description?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: { enum: ['todo', 'in_progress', 'review', 'done'] },
    default: 'todo',
  })
  status: 'todo' | 'in_progress' | 'review' | 'done';

  @property({
    type: 'string',
    required: true,
    jsonSchema: { enum: ['low', 'medium', 'high'] },
    default: 'medium',
  })
  priority: 'low' | 'medium' | 'high';

  @property({ type: 'string' })
  assignee?: string;

  @property({ type: 'date' })
  dueDate?: Date;

  @property({ type: 'date', defaultFn: 'now' })
  createdAt?: Date;

  constructor(data?: Partial<Task>) {
    super(data);
  }
}

export type TaskWithRelations = Task;
