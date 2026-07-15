import { Button } from '../ui/Button';
import type { Todo } from '../../types/todo';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string;
  onRetry: () => Promise<void>;
  onToggle: (todo: Todo) => Promise<void>;
}

function priorityTone(priority: Todo['priority']): string {
  if (priority === 'high') return 'bg-red-500/15 text-red-300 border-red-500/30';
  if (priority === 'medium') return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  if (priority === 'low') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  return 'bg-secondary text-secondary-foreground border-border';
}

export function TodoList({ todos, loading, error, onRetry, onToggle }: TodoListProps) {
  if (loading) {
    return (
      <section className="glass-panel rounded-2xl p-6" aria-label="Loading todos">
        <div className="mb-4 h-6 w-40 animate-pulse rounded bg-secondary" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Unable to load todos</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-4" variant="outline" onClick={() => void onRetry()}>
          Retry
        </Button>
      </section>
    );
  }

  if (todos.length === 0) {
    return (
      <section className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold">No tasks found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first task or adjust the search and filter controls.
        </p>
      </section>
    );
  }

  return (
    <section className="glass-panel rounded-2xl p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Todo list</h2>
          <p className="text-sm text-muted-foreground">{todos.length} tasks in view.</p>
        </div>
      </div>

      <ul className="space-y-3" aria-label="Todo list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="rounded-xl border border-border/80 bg-surface-secondary/60 p-4 transition-all duration-200 hover:border-brand-teal/50 hover:shadow-lg hover:shadow-black/10"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <input
                  id={`toggle-${todo.id}`}
                  type="checkbox"
                  className="mt-1 h-5 w-5 rounded border-input bg-background text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  checked={todo.completed}
                  aria-label={`Mark ${todo.title} as ${todo.completed ? 'incomplete' : 'complete'}`}
                  onChange={() => void onToggle(todo)}
                />
                <div>
                  <p className={todo.completed ? 'text-sm line-through text-muted-foreground' : 'text-sm font-medium'}>
                    {todo.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className={['rounded-full border px-2 py-1', priorityTone(todo.priority)].join(' ')}>
                      {todo.priority ?? 'No priority'}
                    </span>
                    <span className="rounded-full border border-border px-2 py-1 text-muted-foreground">
                      {todo.label ?? 'No label'}
                    </span>
                    <span className="rounded-full border border-border px-2 py-1 text-muted-foreground">
                      {todo.completed ? 'Completed' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" onClick={() => void onToggle(todo)}>
                {todo.completed ? 'Mark active' : 'Mark complete'}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}