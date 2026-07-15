import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { Priority, TodoCreate } from '../../types/todo';

interface TodoFormProps {
  onSubmit: (payload: TodoCreate) => Promise<void>;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'' | Priority>('');
  const [label, setLabel] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit({
        title: title.trim(),
        due_date: null,
        priority: priority || null,
        label: label.trim() || null,
      });
      setTitle('');
      setPriority('');
      setLabel('');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to create todo');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="glass-panel rounded-2xl p-6" onSubmit={handleSubmit}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Create a todo</h2>
          <p className="text-sm text-muted-foreground">Add a task with optional priority and label.</p>
        </div>
        <Button type="submit" aria-disabled={submitting} disabled={submitting}>
          {submitting ? 'Adding…' : 'Add todo'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Input
          id="todo-title"
          label="Title"
          placeholder="Plan sprint review"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={error}
          aria-required="true"
          required
        />
        <Select
          id="todo-priority"
          label="Priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as '' | Priority)}
        >
          <option value="">Any priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
        <Input
          id="todo-label"
          label="Label"
          placeholder="Work"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
        />
      </div>
    </form>
  );
}