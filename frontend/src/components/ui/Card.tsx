import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('surface-panel p-6', className)} {...props}>
      {children}
    </div>
  );
}
