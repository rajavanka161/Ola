import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

// AC-7: core todo rendering and interaction behavior, including rendering the todo list UI,
// creating or updating visible todo state through user interaction, and search/filter behavior.

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('todo UI contract', () => {
  it('renders the todo list UI with the existing items visible', async () => {
    const module = await import('../frontend/src/App');
    const App = (module as any).default ?? module;

    render(<App />);

    expect(screen.getByText(/todo/i)).toBeVisible();
    expect(screen.getByText(/learn/i)).toBeVisible();
  });

  it('creates or updates visible todo state through user interaction', async () => {
    const module = await import('../frontend/src/App');
    const App = (module as any).default ?? module;

    render(<App />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Write tests' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Write tests')).toBeVisible();
  });

  it('filters visible todos by search text', async () => {
    const module = await import('../frontend/src/App');
    const App = (module as any).default ?? module;

    render(<App />);

    const search = screen.getByRole('textbox', { name: /search/i });
    fireEvent.change(search, { target: { value: 'buy' } });

    expect(screen.getByText(/buy/i)).toBeVisible();
    expect(screen.queryByText(/learn/i)).not.toBeInTheDocument();
  });
});
