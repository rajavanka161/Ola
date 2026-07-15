import { apiDelete, apiGet, apiPost, apiPut } from './base';
import type { Todo, TodoCreate, TodoFilters, TodoUpdate } from '../types/todo';

function buildQuery(filters: TodoFilters): string {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set('search', filters.search.trim());
  }

  if (filters.completed === 'active') {
    params.set('completed', 'false');
  }

  if (filters.completed === 'completed') {
    params.set('completed', 'true');
  }

  if (filters.priority) {
    params.set('priority', filters.priority);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

export function fetchTodos(filters: TodoFilters): Promise<Todo[]> {
  return apiGet<Todo[]>(`/api/todos${buildQuery(filters)}`);
}

export function createTodo(body: TodoCreate): Promise<Todo> {
  return apiPost<Todo, TodoCreate>('/api/todos', body);
}

export function updateTodo(id: string, body: TodoUpdate): Promise<Todo> {
  return apiPut<Todo, TodoUpdate>(`/api/todos/${id}`, body);
}

export function deleteTodo(id: string): Promise<void> {
  return apiDelete(`/api/todos/${id}`);
}