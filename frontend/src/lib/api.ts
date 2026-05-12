import { useCallback, useEffect, useState } from 'react';
import type { Project, ProjectStatus, Task, TaskPriority, TaskStatus } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface LoopbackErrorBody {
  error?: {
    message?: string;
    code?: string;
    details?: Array<{ path?: string; message?: string; code?: string }>;
  };
}

export class ApiError extends Error {
  status: number;
  details?: NonNullable<LoopbackErrorBody['error']>['details'];
  constructor(status: number, message: string, details?: NonNullable<LoopbackErrorBody['error']>['details']) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function buildError(res: Response, path: string): Promise<ApiError> {
  let body: LoopbackErrorBody | undefined;
  try {
    body = (await res.json()) as LoopbackErrorBody;
  } catch {
    // body wasn't JSON; fall through with no detail
  }
  const err = body?.error;
  const fields =
    err?.details
      ?.map((d) => [d.path, d.message].filter(Boolean).join(' '))
      .filter(Boolean)
      .join('; ') ?? '';
  const summary = [err?.message, fields && `(${fields})`].filter(Boolean).join(' ');
  const message = summary
    ? `API ${res.status} on ${path}: ${summary}`
    : `API ${res.status} on ${path}`;
  return new ApiError(res.status, message, err?.details);
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw await buildError(res, path);
  }
  return res.json() as Promise<T>;
}

export const listProjects = () => api<Project[]>('/projects');
export const listTasks = () => api<Task[]>('/tasks');
export const listTasksForProject = (projectId: string) =>
  api<Task[]>(`/projects/${projectId}/tasks`);

export const searchProjects = (query: string) => {
  const ilike = `%${query}%`;
  const filter = JSON.stringify({
    where: { or: [{ name: { ilike } }, { description: { ilike } }] },
    limit: 50,
  });
  return api<Project[]>(`/projects?filter=${encodeURIComponent(filter)}`);
};

export const searchTasks = (query: string) => {
  const ilike = `%${query}%`;
  const filter = JSON.stringify({
    where: { or: [{ title: { ilike } }, { description: { ilike } }] },
    limit: 50,
  });
  return api<Task[]>(`/tasks?filter=${encodeURIComponent(filter)}`);
};

export interface CreateProjectPayload {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  membersCount: number;
  dueDate?: string; // ISO 8601 date-time
}

export interface CreateTaskPayload {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: string; // ISO 8601 date-time
}

export const createProject = (payload: CreateProjectPayload) =>
  api<Project>('/projects', { method: 'POST', body: JSON.stringify(payload) });

export const createTask = (payload: CreateTaskPayload) =>
  api<Task>('/tasks', { method: 'POST', body: JSON.stringify(payload) });

/** Convert an HTML <input type="date"> value (YYYY-MM-DD) to an ISO 8601
 *  date-time string at UTC midnight, suitable for LoopBack `type: 'date'`. */
export function toIsoDateTime(htmlDate: string): string | undefined {
  if (!htmlDate) return undefined;
  const d = new Date(htmlDate);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export interface ApiState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
}

export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadIdx, setReloadIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadIdx]);

  const refetch = useCallback(() => setReloadIdx((i) => i + 1), []);

  return { data, error, loading, refetch };
}
