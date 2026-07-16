import { FormEvent, useState } from 'react';

interface TodoCreateFormProps {
  onCreate: (text: string) => Promise<unknown>;
  isSubmitting: boolean;
}

export default function TodoCreateForm({ onCreate, isSubmitting }: TodoCreateFormProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) {
      setError('Enter a todo before submitting.');
      return;
    }

    try {
      setError(null);
      await onCreate(trimmedText);
      setText('');
    } catch {
      // App-level error banner handles request failures.
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <div className="input-wrap">
        <label className="field-label" htmlFor="todo-text">
          Add a new todo
        </label>
        <input
          id="todo-text"
          className="text-input"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What needs to get done?"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'todo-text-error' : undefined}
          disabled={isSubmitting}
        />
        {error && (
          <p id="todo-text-error" className="todo-meta" role="alert">
            {error}
          </p>
        )}
      </div>
      <button type="submit" className="primary-button" disabled={isSubmitting} aria-disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Add todo'}
      </button>
    </form>
  );
}
