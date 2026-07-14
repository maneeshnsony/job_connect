import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

const mockOutreach = { id: 1, company: 'Acme Corp', sector: 'Tech', recruiter: 'John Doe', linkedin: null, msg_sent: null, reply: null, next_action: null, created_at: '', updated_at: '' };

describe('DeleteConfirmModal', () => {
  it('renders outreach company name', () => {
    render(<DeleteConfirmModal outreach={mockOutreach} onClose={vi.fn()} onConfirm={vi.fn()} saving={false} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('calls onConfirm on delete click', () => {
    const onConfirm = vi.fn();
    render(<DeleteConfirmModal outreach={mockOutreach} onClose={vi.fn()} onConfirm={onConfirm} saving={false} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onClose on cancel click', () => {
    const onClose = vi.fn();
    render(<DeleteConfirmModal outreach={mockOutreach} onClose={onClose} onConfirm={vi.fn()} saving={false} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('disables buttons while saving', () => {
    render(<DeleteConfirmModal outreach={mockOutreach} onClose={vi.fn()} onConfirm={vi.fn()} saving={true} />);
    expect(screen.getByText('Deleting...')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });
});
