import { useEffect, useMemo, useState } from 'react';
import { ListFilter, RefreshCw, Sparkles } from 'lucide-react';
import { AppShell } from './components/layout/AppShell';
import { Alert } from './components/ui/Alert';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { createTodo, deleteTodo, fetchTodos, updateTodo } from './components/features/api';
import { TodoFilters } from './components/features/TodoFilters';
import { TodoForm, normalizeFormValues, type TodoFormValues } from './components/features/TodoForm';
import { TodoList } from './components/features/TodoList';
import type { Todo, TodoFilters as TodoFiltersType } from './components/features/types';

const defaultFilters: TodoFiltersType = {
  search: '',
  completed: 'all',
  priority: 'all',
  label: '',
};

const emptyForm: TodoFormValues = {
  title: '',
  due_date: '',
  priority: '',
  label: '',
};

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  const stored = window.localStorage.getItem('brightcone-theme');
  if (stored === 'light') {
    return false;
  }
  if (stored === 'dark') {
    return true;
  }
  return true;
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState<TodoFiltersType>(defaultFilters);
  const [formValues, setFormValues] = useState<TodoFormValues>(emptyForm);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pendingTodoId, setPendingTodoId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Loading todos…');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    window.localStorage.setItem('brightcone-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  async function loadTodos(nextFilters: TodoFiltersType = filters): Promise<void> {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchTodos(nextFilters);
      setTodos(data);
      setStatusMessage(`Loaded ${data.length} todo${data.length === 1 ? '' : 's'}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load todos.';
      setErrorMessage(message);
      setStatusMessage('Unable to load todos.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTodos(filters);
  }, [filters]);

  const summary = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const remaining = total - completed;
    return { total, completed, remaining };
  }, [todos]);

  const isEditing = editingTodoId !== null;

  function resetForm(): void {
    setFormValues(emptyForm);
    setEditingTodoId(null);
  }

  async function handleSubmit(): Promise<void> {
    const normalized = normalizeFormValues(formValues);
    if (!normalized.title) {
      setErrorMessage('Title is required.');
      setStatusMessage('Unable to submit todo.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (editingTodoId) {
        const existing = todos.find((todo) => todo.id === editingTodoId);
        if (!existing) {
          throw new Error('The selected todo no longer exists.');
        }

        await updateTodo(editingTodoId, {
          ...normalized,
          completed: existing.completed,
        });
        setStatusMessage('Todo updated successfully.');
      } else {
        await createTodo(normalized);
        setStatusMessage('Todo created successfully.');
      }

      resetForm();
      await loadTodos(filters);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save todo.';
      setErrorMessage(message);
      setStatusMessage('Unable to save todo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(todo: Todo): Promise<void> {
    setPendingTodoId(todo.id);
    setErrorMessage(null);

    try {
      await updateTodo(todo.id, {
        title: todo.title,
        due_date: todo.due_date,
        priority: todo.priority,
        label: todo.label,
        completed: !todo.completed,
      });
      setStatusMessage(`Todo marked as ${todo.completed ? 'incomplete' : 'complete'}.`);
      await loadTodos(filters);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update todo.';
      setErrorMessage(message);
      setStatusMessage('Unable to update todo.');
    } finally {
      setPendingTodoId(null);
    }
  }

  async function handleDelete(todo: Todo): Promise<void> {
    setPendingTodoId(todo.id);
    setErrorMessage(null);

    try {
      await deleteTodo(todo.id);
      if (editingTodoId === todo.id) {
        resetForm();
      }
      setStatusMessage('Todo deleted successfully.');
      await loadTodos(filters);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete todo.';
      setErrorMessage(message);
      setStatusMessage('Unable to delete todo.');
    } finally {
      setPendingTodoId(null);
    }
  }

  function handleEdit(todo: Todo): void {
    setEditingTodoId(todo.id);
    setFormValues({
      title: todo.title,
      due_date: todo.due_date ?? '',
      priority: todo.priority ?? '',
      label: todo.label ?? '',
    });
    setErrorMessage(null);
    setStatusMessage(`Editing ${todo.title}.`);
  }

  function updateFormField(field: keyof TodoFormValues, value: string): void {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  function updateFilterField(field: keyof TodoFiltersType, value: string): void {
    const nextFilters = { ...filters, [field]: value } as TodoFiltersType;
    setFilters(nextFilters);
  }

  return (
    <AppShell isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((current) => !current)}>
      <section className="mb-6 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="glass-panel overflow-hidden bg-card/75">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" /> BrightCone productivity
              </div>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Manage priorities, due dates, and labels from one polished todo hub.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Search, filter, create, edit, and complete work items with backend-backed persistence and accessible controls.
              </p>
            </div>
            <Button variant="outline" onClick={() => void loadTodos(filters)} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </Card>

        <Card className="glass-panel">
          <div className="mb-4 flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Workspace summary</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-xl border border-border/70 bg-background/50 p-4">
              <p className="text-sm text-muted-foreground">Total todos</p>
              <p className="mt-2 text-2xl font-semibold">{summary.total}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/50 p-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="mt-2 text-2xl font-semibold">{summary.completed}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/50 p-4">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="mt-2 text-2xl font-semibold">{summary.remaining}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="default">Searchable</Badge>
            <Badge tone="success">Dark mode</Badge>
            <Badge tone="warning">Backend synced</Badge>
          </div>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          {errorMessage ? <Alert tone="error">{errorMessage}</Alert> : null}
          <Alert tone="info">
            <span aria-live="polite">{statusMessage}</span>
          </Alert>
          <TodoForm
            values={formValues}
            onChange={updateFormField}
            onSubmit={() => void handleSubmit()}
            onCancelEdit={isEditing ? resetForm : undefined}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
          />
          <TodoFilters filters={filters} onChange={updateFilterField} />
        </div>

        <section aria-label="Todo list" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Todo list</h2>
              <p className="text-sm text-muted-foreground">Live results from GET /api/todos with active filters applied.</p>
            </div>
            <Badge tone="muted">{todos.length} visible</Badge>
          </div>
          <TodoList
            todos={todos}
            isLoading={isLoading}
            pendingTodoId={pendingTodoId}
            onEdit={handleEdit}
            onToggle={(todo) => void handleToggle(todo)}
            onDelete={(todo) => void handleDelete(todo)}
          />
        </section>
      </div>
    </AppShell>
  );
}
