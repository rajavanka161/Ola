import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, ListTodo, Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [createError, setCreateError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos]);

  async function loadTodos(showRefreshState = false) {
    if (showRefreshState) {
      setIsRefreshing(true);
    } else {
      setInitialLoading(true);
    }

    setLoadError('');

    try {
      const response = await fetch(`${API_BASE}/api/todos`);

      if (!response.ok) {
        throw new Error(`Failed to load todos (${response.status})`);
      }

      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load todos.');
    } finally {
      setInitialLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    void loadTodos();
  }, []);

  async function handleCreateTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = newTodoText.trim();
    if (!text) {
      setCreateError('Enter a todo before adding it.');
      return;
    }

    setIsCreating(true);
    setCreateError('');
    setActionError('');

    try {
      const response = await fetch(`${API_BASE}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create todo (${response.status})`);
      }

      const createdTodo: Todo = await response.json();
      setTodos((currentTodos) => [createdTodo, ...currentTodos]);
      setNewTodoText('');
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Unable to create todo.');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggleTodo(todo: Todo) {
    setActionError('');
    setPendingIds((current) => [...current, todo.id]);

    try {
      const response = await fetch(`${API_BASE}/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update todo (${response.status})`);
      }

      const updatedTodo: Todo = await response.json();
      setTodos((currentTodos) =>
        currentTodos.map((currentTodo) => (currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo)),
      );
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update todo.');
    } finally {
      setPendingIds((current) => current.filter((id) => id !== todo.id));
    }
  }

  async function handleDeleteTodo(todoId: number) {
    setActionError('');
    setPendingIds((current) => [...current, todoId]);

    try {
      const response = await fetch(`${API_BASE}/api/todos/${todoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete todo (${response.status})`);
      }

      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete todo.');
    } finally {
      setPendingIds((current) => current.filter((id) => id !== todoId));
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 35%), linear-gradient(180deg, #0f172a 0%, #111827 100%)',
        color: '#e5eefb',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: '0 auto',
          display: 'grid',
          gap: 24,
        }}
      >
        <section
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.35)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: 16,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: 'rgba(59, 130, 246, 0.12)',
                  color: '#93c5fd',
                  marginBottom: 14,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <ListTodo size={16} />
                Live Todo Board
              </div>
              <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05 }}>Stay on top of your tasks</h1>
              <p style={{ margin: '12px 0 0', color: '#cbd5e1', maxWidth: 560, lineHeight: 1.6 }}>
                Add, complete, and remove todos with data synced to your backend API.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadTodos(true)}
              disabled={isRefreshing || initialLoading}
              aria-label="Refresh todos"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                borderRadius: 14,
                border: '1px solid rgba(148, 163, 184, 0.25)',
                background: 'rgba(30, 41, 59, 0.85)',
                color: '#f8fafc',
                padding: '12px 16px',
                fontWeight: 600,
                cursor: isRefreshing || initialLoading ? 'not-allowed' : 'pointer',
                opacity: isRefreshing || initialLoading ? 0.65 : 1,
              }}
            >
              <RefreshCw size={16} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 14,
              marginBottom: 24,
            }}
          >
            {[
              { label: 'Total', value: todos.length },
              { label: 'Completed', value: completedCount },
              { label: 'Remaining', value: todos.length - completedCount },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  borderRadius: 18,
                  border: '1px solid rgba(148, 163, 184, 0.18)',
                  background: 'rgba(15, 23, 42, 0.55)',
                  padding: 18,
                }}
              >
                <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 30, fontWeight: 700 }}>{item.value}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCreateTodo} style={{ display: 'grid', gap: 12 }}>
            <label htmlFor="todo-text" style={{ fontWeight: 600, fontSize: 15 }}>
              New todo
            </label>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input
                id="todo-text"
                type="text"
                value={newTodoText}
                onChange={(event) => setNewTodoText(event.target.value)}
                placeholder="Write your next task"
                aria-required="true"
                disabled={isCreating}
                style={{
                  flex: '1 1 280px',
                  borderRadius: 14,
                  border: '1px solid rgba(148, 163, 184, 0.22)',
                  background: 'rgba(15, 23, 42, 0.92)',
                  color: '#f8fafc',
                  padding: '14px 16px',
                  fontSize: 16,
                }}
              />
              <button
                type="submit"
                disabled={isCreating}
                aria-disabled={isCreating}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  border: 'none',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                  color: '#eff6ff',
                  padding: '14px 18px',
                  fontWeight: 700,
                  minWidth: 160,
                  cursor: isCreating ? 'not-allowed' : 'pointer',
                  opacity: isCreating ? 0.75 : 1,
                }}
              >
                {isCreating ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={18} />}
                {isCreating ? 'Adding...' : 'Add todo'}
              </button>
            </div>
            {createError ? <p style={{ margin: 0, color: '#fca5a5' }}>{createError}</p> : null}
          </form>
        </section>

        <section
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.35)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontSize: 24 }}>Todos</h2>
            <span style={{ color: '#94a3b8' }}>{todos.length} item(s)</span>
          </div>

          {loadError ? (
            <div
              style={{
                borderRadius: 18,
                border: '1px solid rgba(248, 113, 113, 0.35)',
                background: 'rgba(127, 29, 29, 0.2)',
                padding: 18,
              }}
            >
              <p style={{ margin: '0 0 12px', color: '#fecaca' }}>{loadError}</p>
              <button
                type="button"
                onClick={() => void loadTodos()}
                style={{
                  borderRadius: 12,
                  border: '1px solid rgba(248, 113, 113, 0.35)',
                  background: 'transparent',
                  color: '#fee2e2',
                  padding: '10px 14px',
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
            </div>
          ) : null}

          {actionError ? (
            <p style={{ margin: loadError ? '14px 0 0' : '0 0 14px', color: '#fca5a5' }}>{actionError}</p>
          ) : null}

          {initialLoading ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  style={{
                    height: 72,
                    borderRadius: 18,
                    background: 'linear-gradient(90deg, rgba(30,41,59,0.8), rgba(51,65,85,0.95), rgba(30,41,59,0.8))',
                    backgroundSize: '200% 100%',
                    animation: 'pulse-slide 1.4s ease infinite',
                  }}
                />
              ))}
            </div>
          ) : !loadError && todos.length === 0 ? (
            <div
              style={{
                borderRadius: 20,
                border: '1px dashed rgba(148, 163, 184, 0.3)',
                padding: '36px 18px',
                textAlign: 'center',
                color: '#cbd5e1',
              }}
            >
              <ListTodo size={28} style={{ marginBottom: 12 }} />
              <h3 style={{ margin: '0 0 8px' }}>No tasks found</h3>
              <p style={{ margin: 0 }}>Create your first task to get started.</p>
            </div>
          ) : !loadError ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {todos.map((todo) => {
                const isPending = pendingIds.includes(todo.id);

                return (
                  <article
                    key={todo.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 14,
                      padding: 16,
                      borderRadius: 18,
                      border: '1px solid rgba(148, 163, 184, 0.16)',
                      background: todo.completed ? 'rgba(22, 101, 52, 0.22)' : 'rgba(15, 23, 42, 0.58)',
                      opacity: isPending ? 0.7 : 1,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => void handleToggleTodo(todo)}
                      disabled={isPending}
                      aria-label={todo.completed ? `Mark ${todo.text} incomplete` : `Mark ${todo.text} complete`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: '#e2e8f0',
                        textAlign: 'left',
                        cursor: isPending ? 'not-allowed' : 'pointer',
                        padding: 0,
                      }}
                    >
                      {todo.completed ? <CheckCircle2 size={22} color="#4ade80" /> : <Circle size={22} color="#93c5fd" />}
                      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#bbf7d0' : '#f8fafc' }}>
                        {todo.text}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDeleteTodo(todo.id)}
                      disabled={isPending}
                      aria-label={`Delete ${todo.text}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        border: '1px solid rgba(248, 113, 113, 0.28)',
                        background: 'rgba(127, 29, 29, 0.18)',
                        color: '#fca5a5',
                        cursor: isPending ? 'not-allowed' : 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      {isPending ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={18} />}
                    </button>
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-slide {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </main>
  );
}
