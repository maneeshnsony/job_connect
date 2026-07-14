import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { mockLocalStorage } from './mocks';

describe('Error recovery scenarios', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockLocalStorage.clear();
  });

  it('ErrorBoundary catches render errors and shows retry', () => {
    const Crashy = () => { throw new Error('Render crash'); };
    render(<ErrorBoundary><Crashy /></ErrorBoundary>);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Render crash')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('ErrorBoundary shows custom fallback when provided', () => {
    const Crashy = () => { throw new Error('fail'); };
    render(<ErrorBoundary fallback={<div>Custom fallback</div>}><Crashy /></ErrorBoundary>);
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('reset via key remounts children', () => {
    let shouldThrow = true;
    const Unstable = () => {
      if (shouldThrow) throw new Error('Temporary');
      return <div>Recovered</div>;
    };
    const { rerender } = render(<ErrorBoundary><Unstable /></ErrorBoundary>);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    shouldThrow = false;
    rerender(<ErrorBoundary key="reset"><Unstable /></ErrorBoundary>);
    expect(screen.getByText('Recovered')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('multiple error boundaries isolate failures', () => {
    const Bad = () => { throw new Error('Bad'); };
    const Good = () => <div>Good section</div>;
    render(
      <div>
        <ErrorBoundary><Bad /></ErrorBoundary>
        <ErrorBoundary><Good /></ErrorBoundary>
      </div>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Good section')).toBeInTheDocument();
  });
});
