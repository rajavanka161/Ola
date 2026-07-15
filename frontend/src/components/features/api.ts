import type { Todo, TodoCreateInput, TodoFilters, TodoUpdateInput } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

type ApiError = Error & { status?: number };

type ValidationDetail = {
  msg?: string;
};

function buildQuery(filters: TodoFilters): string {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set('search', filters.search.trim());
  }

  if (filters.completed === 'complete') {
    params.set('completed', 'true');
  }

  if (filters.completed === 'incomplete') {
    params.set('completed', 'false');
  }

  if (filters.priority !== 'all') {
    params.set('priority', filters.priority);
  }

  if (filters.label.trim()) {
    params.set('label', filters.label.trim());
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

async function parseError(response: Response): Promise<ApiError> {
  let message = `Request failed with status ${response.status}`;

  try {
    const data: unknown = await response.json();
    if (typeof data === 'object' && data !== null) {
      const detail = (data as { detail?: unknown }).detail;
      if (typeof detail === 'string') {
        message = detail;
      } else if (Array.isArray(detail)) {
        const validationMessage = detail
          .map((item) => (typeof item === 'object' && item !== null ? (item as ValidationDetail).msg : null))
          .filter((item): item is string => typeof item === 'string')
          .join(', ');
        if (validationMessage) {
          message = validationMessage;
        }
      }
    }
  } catch {
    // ignore invalid json error bodies
  }

  const error = new Error(message) as ApiError;
  error.status = response.status;
  return error;
}

export async function fetchTodos(filters: TodoFilters): Promise<Todo[]> {
  const response = await fetch(`${API_BASE}/api/todos${buildQuery(filters)}`);
  if (!response.ok) {
    throw await parseError(response);
  }
  return (await response.json()) as Todo[];
}

export async function createTodo(input: TodoCreateInput): Promise<Todo> {
  const response = await fetch(`${API_BASE}/api/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as Todo;
}

export async function updateTodo(id: string, input: TodoUpdateInput): Promise<Todo> {
  const response = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as Todo;
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw await parseError(response);
  }
}
