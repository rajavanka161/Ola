import type { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  isUpdating: boolean;
  isDeleting: boolean;
  onToggleCompleted: (todo: Todo) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
}

function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'Created recently';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function TodoItem({
  todo,
  isUpdating,
  isDeleting,
  onToggleCompleted,
  onDelete,
}: TodoItemProps) {
  return (
    <article className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        className="checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => {
          void onToggleCompleted(todo);
        }}
        disabled={isUpdating || isDeleting}
        aria-label={todo.completed ? `Mark ${todo.text} as not completed` : `Mark ${todo.text} as completed`}
      />

      <div className="todo-main">
        <span className="todo-text">{todo.text}</span>
        <p className="todo-meta">{formatCreatedAt(todo.created_at)}</p>
      </div>

      <div className="todo-actions">
        {isUpdating && <span className="todo-meta">Updating…</span>}
        <button
          type="button"
          className="icon-button"
          onClick={() => {
            void onDelete(todo.id);
          }}
          disabled={isDeleting || isUpdating}
          aria-label={`Delete ${todo.text}`}
        >
          {isDeleting ? '…' : 'Delete'}
        </button>
      </div>
    </article>
  );
}
