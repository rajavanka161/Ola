import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ id, label, error, className = '', ...props }: InputProps) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        className={[
          'flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          error ? 'border-destructive' : '',
          className,
        ].join(' ')}
        aria-describedby={describedBy}
        {...props}
      />
      {error ? (
        <p id={describedBy} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}