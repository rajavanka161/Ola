import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TodoCreateForm from './components/features/TodoCreateForm';
import TodoFilters, { type TodoFilterValue } from './components/features/TodoFilters';
import TodoList from './components/features/TodoList';
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
  type UpdateTodoInput,
} from './api-client/todos';
import type { Todo } from './types/todo';

const TODOS_QUERY_KEY = ['todos'];

export default function App() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<TodoFilterValue>('all');
  const [actionError, setActionError] = useState<string | null>(null);

  const todosQuery = useQuery<Todo[], Error>({
    queryKey: TODOS_QUERY_KEY,
    queryFn: fetchTodos,
  });

  const createMutation = useMutation<Todo, Error, string>({
    mutationFn: createTodo,
    onMutate: () => {
      setActionError(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
    onError: (error) => {
      setActionError(error.message);
    },
  });

  const updateMutation = useMutation<Todo, Error, { id: number; input: UpdateTodoInput }>({
    mutationFn: ({ id, input }) => updateTodo(id, input),
    onMutate: () => {
      setActionError(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
    onError: (error) => {
      setActionError(error.message);
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: deleteTodo,
    onMutate: () => {
      setActionError(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
    onError: (error) => {
      setActionError(error.message);
    },
  });

  const filteredTodos = useMemo(() => {
    const todos = todosQuery.data ?? [];

    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [filter, todosQuery.data]);

  const totalCount = todosQuery.data?.length ?? 0;
  const completedCount = todosQuery.data?.filter((todo) => todo.completed).length ?? 0;
  const activeCount = totalCount - completedCount;

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">Connected to your backend</span>
          <h1>Todo flow that stays in sync</h1>
          <p>
            Create tasks, mark them complete, and delete them with backend persistence so
            your list survives every refresh.
          </p>
        </div>

        <div className="stats-grid" aria-label="Todo summary">
          <article className="stat-card">
            <span>Total</span>
            <strong>{totalCount}</strong>
          </article>
          <article className="stat-card">
            <span>Active</span>
            <strong>{activeCount}</strong>
          </article>
          <article className="stat-card">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </article>
        </div>
      </section>

      <section className="panel">
        <TodoCreateForm
          onCreate={(text) => createMutation.mutateAsync(text)}
          isSubmitting={createMutation.isPending}
        />

        <TodoFilters
          value={filter}
          onChange={setFilter}
          totalCount={totalCount}
          activeCount={activeCount}
          completedCount={completedCount}
        />

        {(todosQuery.isError || actionError) && (
          <div className="error-banner" role="alert">
            <div>
              <strong>Something went wrong.</strong>
              <p>{actionError ?? todosQuery.error?.message}</p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setActionError(null);
                void todosQuery.refetch();
              }}
            >
              Retry
            </button>
          </div>
        )}

        <TodoList
          todos={filteredTodos}
          isLoading={todosQuery.isLoading}
          isFetching={todosQuery.isFetching}
          filter={filter}
          updatingTodoId={updateMutation.variables?.id}
          deletingTodoId={deleteMutation.variables}
          onToggleCompleted={(todo) =>
            updateMutation.mutateAsync({
              id: todo.id,
              input: { text: null, completed: !todo.completed },
            })
          }
          onDelete={(id) => deleteMutation.mutateAsync(id)}
        />
      </section>
    </main>
  );
}
