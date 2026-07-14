import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from '@/components/Pagination';

const baseMeta = { current_page: 1, last_page: 5, per_page: 20, total: 100, from: 1, to: 20 };

describe('Pagination', () => {
  it('renders nothing when only one page', () => {
    const { container } = render(<Pagination meta={{ ...baseMeta, last_page: 1 }} onPageChange={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays record range and total', () => {
    render(<Pagination meta={baseMeta} onPageChange={vi.fn()} />);
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('calls onPageChange when page button clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination meta={baseMeta} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables prev button on first page', () => {
    render(<Pagination meta={baseMeta} onPageChange={vi.fn()} />);
    const prevBtn = screen.getByLabelText('Previous page');
    expect(prevBtn).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination meta={{ ...baseMeta, current_page: 5 }} onPageChange={vi.fn()} />);
    const nextBtn = screen.getByLabelText('Next page');
    expect(nextBtn).toBeDisabled();
  });
});
