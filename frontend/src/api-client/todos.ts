import { apiDelete, apiGet, apiPatch, apiPost } from './base';
import type { Todo } from '../types/todo';

export type CreateTodoInput = {
  text: string;
};

export type UpdateTodoInput = {
  text: string | null;
  completed: boolean | null;
};

export function fetchTodos(): Promise<Todo[]> {
  return apiGet<Todo[]>('/api/todos');
}

export function createTodo(text: string): Promise<Todo> {
  const payload: CreateTodoInput = { text };
  return apiPost<Todo>('/api/todos', payload);
}

export function updateTodo(id: number, input: UpdateTodoInput): Promise<Todo> {
  return apiPatch<Todo>(`/api/todos/${id}`, input);
}

export function deleteTodo(id: number): Promise<void> {
  return apiDelete(`/api/todos/${id}`);
}
