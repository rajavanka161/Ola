import { cn } from './utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-lg bg-muted/70', className)} aria-hidden="true" />;
}
