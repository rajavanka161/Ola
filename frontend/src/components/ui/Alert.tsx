import type { HTMLAttributes, ReactNode } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from './utils';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tone?: 'error' | 'success' | 'info';
}

const toneStyles = {
  error: 'border-destructive/40 bg-destructive/10 text-destructive-foreground',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-foreground',
  info: 'border-border bg-muted/40 text-foreground',
} as const;

const Icon = {
  error: AlertCircle,
  success: CheckCircle2,
  info: AlertCircle,
} as const;

export function Alert({ className, children, tone = 'info', ...props }: AlertProps) {
  const ToneIcon = Icon[tone];

  return (
    <div
      className={cn('flex items-start gap-3 rounded-xl border px-4 py-3 text-sm', toneStyles[tone], className)}
      role={tone === 'error' ? 'alert' : 'status'}
      {...props}
    >
      <ToneIcon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
