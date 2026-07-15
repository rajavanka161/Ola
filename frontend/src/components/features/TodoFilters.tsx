import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { Priority, TodoFilters as TodoFilterState } from '../../types/todo';

interface TodoFiltersProps {
  filters: TodoFilterState;
  onChange: (next: TodoFilterState) => void;
}

export function TodoFilters({ filters, onChange }: TodoFiltersProps) {
  return (
    <section className="glass-panel rounded-2xl p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Search and filter</h2>
        <p className="text-sm text-muted-foreground">Use these controls to narrow the todo list.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Input
          id="search-todos"
          label="Search todos"
          placeholder="Search by title"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
        <Select
          id="filter-status"
          label="Completion"
          value={filters.completed}
          onChange={(event) =>
            onChange({
              ...filters,
              completed: event.target.value as TodoFilterState['completed'],
            })
          }
        >
          <option value="all">All todos</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </Select>
        <Select
          id="filter-priority"
          label="Priority"
          value={filters.priority}
          onChange={(event) => onChange({ ...filters, priority: event.target.value as '' | Priority })}
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </div>
    </section>
  );
}