import { useCallback, useEffect, useState } from 'react';
import type { Project, Task } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} on ${path}`);
  }
  return res.json() as Promise<T>;
}

export const listProjects = () => api<Project[]>('/projects');
export const listTasks = () => api<Task[]>('/tasks');
export const listTasksForProject = (projectId: string) =>
  api<Task[]>(`/projects/${projectId}/tasks`);

export const createProject = (project: Project) =>
  api<Project>('/projects', { method: 'POST', body: JSON.stringify(project) });

export const createTask = (task: Task) =>
  api<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) });

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
