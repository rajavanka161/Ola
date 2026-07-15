import { useEffect, useMemo, useState } from 'react';
import { createTodo, fetchTodos, updateTodo } from './api-client/todos';
import { TodoFilters } from './components/features/TodoFilters';
import { TodoForm } from './components/features/TodoForm';
import { TodoList } from './components/features/TodoList';
import type { Todo, TodoFilters as TodoFilterState } from './types/todo';

const initialFilters: TodoFilterState = {
  search: '',
  completed: 'all',
  priority: '',
};

export default function App() {
  const [filters, setFilters] = useState<TodoFilterState>(initialFilters);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTodos(nextFilters: TodoFilterState) {
    setLoading(true);
    setError('');

    try {
      const response = await fetchTodos(nextFilters);
      setTodos(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load todos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTodos(filters);
  }, [filters]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [todos]);

  async function handleCreate(titlePayload: {
    title: string;
    due_date: string | null;
    priority: Todo['priority'];
    label: string | null;
  }) {
    await createTodo(titlePayload);
    await loadTodos(filters);
  }

  async function handleToggle(todo: Todo) {
    await updateTodo(todo.id, {
      title: todo.title,
      due_date: todo.due_date,
      priority: todo.priority,
      label: todo.label,
      completed: !todo.completed,
    });
    await loadTodos(filters);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 overflow-hidden rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(28,201,168,0.2),_transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.78))] p-8 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
                Todo workspace
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Keep tasks organized with fast search and status filters.
              </h1>
              <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
                This hydrated frontend connects to the real todo API so QA can validate list rendering,
                creation flows, completion toggles, and filter interactions.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-slate-300">Total</p>
                <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-slate-300">Active</p>
                <p className="mt-2 text-2xl font-semibold">{stats.active}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-slate-300">Completed</p>
                <p className="mt-2 text-2xl font-semibold">{stats.completed}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <TodoFilters filters={filters} onChange={setFilters} />
            <TodoList
              todos={todos}
              loading={loading}
              error={error}
              onRetry={() => loadTodos(filters)}
              onToggle={handleToggle}
            />
          </div>
          <div>
            <TodoForm onSubmit={handleCreate} />
          </div>
        </div>
      </div>
    </main>
  );
}