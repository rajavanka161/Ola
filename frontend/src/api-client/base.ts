const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path);
}

export function apiPost<T, B>(path: string, body: B): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function apiPut<T, B>(path: string, body: B): Promise<T> {
  return apiRequest<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function apiDelete(path: string): Promise<void> {
  return apiRequest<void>(path, {
    method: 'DELETE',
  });
}