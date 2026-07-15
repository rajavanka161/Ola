import { CalendarDays, Pencil, Tag, Trash2 } from 'lucide-react';
import type { Todo } from './types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { Skeleton } from '../ui/Skeleton';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  pendingTodoId: string | null;
  onEdit: (todo: Todo) => void;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

function priorityTone(priority: Todo['priority']): 'default' | 'warning' | 'muted' {
  if (priority === 'high') {
    return 'warning';
  }
  if (priority === 'medium') {
    return 'default';
  }
  return 'muted';
}

function formatDate(value: string | null): string {
  if (!value) {
    return 'No due date';
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export function TodoList({ todos, isLoading, pendingTodoId, onEdit, onToggle, onDelete }: TodoListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[0, 1, 2].map((item) => (
          <Card key={item} className="space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <Card className="glass-panel flex min-h-[240px] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold">No todos found</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Try adjusting your filters or create your first todo to start tracking work.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4" aria-live="polite">
      {todos.map((todo) => {
        const isPending = pendingTodoId === todo.id;

        return (
          <Card key={todo.id} className="glass-panel p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 gap-4">
                <Checkbox
                  aria-label={todo.completed ? `Mark ${todo.title} incomplete` : `Mark ${todo.title} complete`}
                  checked={todo.completed}
                  disabled={isPending}
                  onChange={() => onToggle(todo)}
                  className="mt-1"
                />
                <div className="min-w-0">
                  <p className={`text-base font-semibold ${todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {todo.title}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" /> {formatDate(todo.due_date)}
                    </span>
                    {todo.label ? (
                      <span className="inline-flex items-center gap-1">
                        <Tag className="h-4 w-4" /> {todo.label}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone={todo.completed ? 'success' : 'muted'}>{todo.completed ? 'completed' : 'open'}</Badge>
                    <Badge tone={priorityTone(todo.priority)}>{todo.priority ?? 'no priority'}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(todo)} disabled={isPending}>
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(todo)} disabled={isPending}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
