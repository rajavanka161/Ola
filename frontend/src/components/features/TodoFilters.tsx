export type TodoFilterValue = 'all' | 'active' | 'completed';

interface TodoFiltersProps {
  value: TodoFilterValue;
  onChange: (value: TodoFilterValue) => void;
  totalCount: number;
  activeCount: number;
  completedCount: number;
}

const filters: Array<{ value: TodoFilterValue; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function TodoFilters({
  value,
  onChange,
  totalCount,
  activeCount,
  completedCount,
}: TodoFiltersProps) {
  const counts: Record<TodoFilterValue, number> = {
    all: totalCount,
    active: activeCount,
    completed: completedCount,
  };

  return (
    <div className="filters" aria-label="Todo filters">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={`filter-button ${value === filter.value ? 'active' : ''}`}
          onClick={() => onChange(filter.value)}
          aria-pressed={value === filter.value}
        >
          {filter.label} ({counts[filter.value]})
        </button>
      ))}
    </div>
  );
}
