import type { ReactNode } from 'react';
import { CheckCheck, MoonStar, SunMedium } from 'lucide-react';
import { Button } from '../ui/Button';

interface AppShellProps {
  children: ReactNode;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function AppShell({ children, isDarkMode, onToggleTheme }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(28,201,168,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.14),transparent_22%)]" />
      <header className="relative border-b border-divider/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              <CheckCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">BrightCone</p>
              <h1 className="text-lg font-semibold">Unified Todo Workspace</h1>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={onToggleTheme}
          >
            {isDarkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
