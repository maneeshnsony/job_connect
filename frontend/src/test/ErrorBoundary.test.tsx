import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const ProblemChild = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) throw new Error('Test error');
  return <div>All good</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error', () => {
    render(<ErrorBoundary><div>Hello</div></ErrorBoundary>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders fallback on error', () => {
    render(<ErrorBoundary><ProblemChild shouldThrow /></ErrorBoundary>);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(<ErrorBoundary fallback={<div>Custom error</div>}><ProblemChild shouldThrow /></ErrorBoundary>);
    expect(screen.getByText('Custom error')).toBeInTheDocument();
  });

  it('resets error state on try again click', () => {
    render(<ErrorBoundary><ProblemChild shouldThrow /></ErrorBoundary>);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Try again'));
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
});
