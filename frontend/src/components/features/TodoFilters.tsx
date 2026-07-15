import { Filter, Search, Tag } from 'lucide-react';
import type { TodoFilters as TodoFiltersType } from './types';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface TodoFiltersProps {
  filters: TodoFiltersType;
  onChange: (field: keyof TodoFiltersType, value: string) => void;
}

export function TodoFilters({ filters, onChange }: TodoFiltersProps) {
  return (
    <Card className="glass-panel p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-semibold">Search & filters</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <label htmlFor="search-filter" className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Search className="h-4 w-4 text-muted-foreground" /> Search
          </label>
          <Input
            id="search-filter"
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
            placeholder="Search by title"
          />
        </div>

        <div>
          <label htmlFor="completed-filter" className="mb-2 block text-sm font-medium">
            Completed state
          </label>
          <Select id="completed-filter" value={filters.completed} onChange={(event) => onChange('completed', event.target.value)}>
            <option value="all">All</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </Select>
        </div>

        <div>
          <label htmlFor="priority-filter" className="mb-2 block text-sm font-medium">
            Priority
          </label>
          <Select id="priority-filter" value={filters.priority} onChange={(event) => onChange('priority', event.target.value)}>
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>

        <div className="md:col-span-2 xl:col-span-4">
          <label htmlFor="label-filter" className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Tag className="h-4 w-4 text-muted-foreground" /> Label
          </label>
          <Input
            id="label-filter"
            value={filters.label}
            onChange={(event) => onChange('label', event.target.value)}
            placeholder="Filter by exact label"
          />
        </div>
      </div>
    </Card>
  );
}
