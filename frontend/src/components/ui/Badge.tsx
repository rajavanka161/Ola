import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'muted';
}

const tones = {
  default: 'bg-primary/15 text-primary',
  success: 'bg-emerald-500/15 text-emerald-500',
  warning: 'bg-amber-500/15 text-amber-500',
  muted: 'bg-muted text-muted-foreground',
} as const;

export function Badge({ className, children, tone = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
