import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ id, label, className = '', children, ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        className={[
          'flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}