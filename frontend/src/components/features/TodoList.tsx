import TodoItem from './TodoItem';
import type { Todo } from '../../types/todo';
import type { TodoFilterValue } from './TodoFilters';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  isFetching: boolean;
  filter: TodoFilterValue;
  updatingTodoId?: number;
  deletingTodoId?: number;
  onToggleCompleted: (todo: Todo) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
}

function TodoListSkeleton() {
  return (
    <div className="skeleton-list" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-row">
            <div className="skeleton-circle" />
            <div>
              <div className="skeleton-pill" />
              <div className="skeleton-line short" />
            </div>
            <div className="skeleton-line" style={{ width: '4rem' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function getEmptyMessage(filter: TodoFilterValue): { title: string; description: string } {
  if (filter === 'active') {
    return {
      title: 'No active todos',
      description: 'Everything is caught up right now. Add a new task to keep momentum going.',
    };
  }

  if (filter === 'completed') {
    return {
      title: 'No completed todos yet',
      description: 'Finish a task and it will appear here with its saved backend state.',
    };
  }

  return {
    title: 'No todos yet',
    description: 'Create your first todo to start building a list backed by the API.',
  };
}

export default function TodoList({
  todos,
  isLoading,
  isFetching,
  filter,
  updatingTodoId,
  deletingTodoId,
  onToggleCompleted,
  onDelete,
}: TodoListProps) {
  if (isLoading) {
    return <TodoListSkeleton />;
  }

  if (todos.length === 0) {
    const emptyState = getEmptyMessage(filter);

    return (
      <div className="empty-state">
        <strong>{emptyState.title}</strong>
        <p>{emptyState.description}</p>
      </div>
    );
  }

  return (
    <section>
      {isFetching && <p className="status-note">Refreshing todo state…</p>}
      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isUpdating={updatingTodoId === todo.id}
            isDeleting={deletingTodoId === todo.id}
            onToggleCompleted={onToggleCompleted}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
