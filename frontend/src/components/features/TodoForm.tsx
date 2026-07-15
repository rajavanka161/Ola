import { CalendarDays, Flag, Tag } from 'lucide-react';
import type { Priority, TodoCreateInput } from './types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export interface TodoFormValues {
  title: string;
  due_date: string;
  priority: '' | Priority;
  label: string;
}

interface TodoFormProps {
  values: TodoFormValues;
  onChange: (field: keyof TodoFormValues, value: string) => void;
  onSubmit: () => void;
  onCancelEdit?: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export function normalizeFormValues(values: TodoFormValues): TodoCreateInput {
  return {
    title: values.title.trim(),
    due_date: values.due_date || null,
    priority: values.priority || null,
    label: values.label.trim() || null,
  };
}

export function TodoForm({
  values,
  onChange,
  onSubmit,
  onCancelEdit,
  isSubmitting,
  isEditing,
}: TodoFormProps) {
  return (
    <Card className="glass-panel p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{isEditing ? 'Edit todo' : 'Create a new todo'}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Capture title, due date, priority, and a single label for organization.</p>
        </div>
      </div>

      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="md:col-span-2">
          <label htmlFor="todo-title" className="mb-2 block text-sm font-medium">
            Title <span aria-hidden="true" className="text-primary">*</span>
          </label>
          <Input
            id="todo-title"
            value={values.title}
            onChange={(event) => onChange('title', event.target.value)}
            placeholder="Ship the release checklist"
            aria-required="true"
            required
          />
        </div>

        <div>
          <label htmlFor="todo-due-date" className="mb-2 flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="h-4 w-4 text-muted-foreground" /> Due date
          </label>
          <Input
            id="todo-due-date"
            type="date"
            value={values.due_date}
            onChange={(event) => onChange('due_date', event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="todo-priority" className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Flag className="h-4 w-4 text-muted-foreground" /> Priority
          </label>
          <Select id="todo-priority" value={values.priority} onChange={(event) => onChange('priority', event.target.value)}>
            <option value="">No priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="todo-label" className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Tag className="h-4 w-4 text-muted-foreground" /> Label
          </label>
          <Input
            id="todo-label"
            value={values.label}
            onChange={(event) => onChange('label', event.target.value)}
            placeholder="Operations, Personal, Launch"
          />
        </div>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={isSubmitting} aria-disabled={isSubmitting}>
            {isSubmitting ? (isEditing ? 'Saving…' : 'Creating…') : isEditing ? 'Save changes' : 'Create todo'}
          </Button>
          {isEditing && onCancelEdit ? (
            <Button type="button" variant="ghost" onClick={onCancelEdit}>
              Cancel edit
            </Button>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
