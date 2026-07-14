import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OutreachModal from '@/components/OutreachModal';

describe('OutreachModal', () => {
  it('renders Add New Record title when outreach is null', () => {
    render(<OutreachModal outreach={null} onClose={vi.fn()} onSave={vi.fn()} saving={false} />);
    expect(screen.getByText('Add New Record')).toBeInTheDocument();
  });

  it('renders Edit Record title when outreach is provided', () => {
    const outreach = { id: 1, company: 'Acme', sector: 'Tech', recruiter: 'John', linkedin: '', msg_sent: '', reply: 'Pending', next_action: '', created_at: '', updated_at: '' };
    render(<OutreachModal outreach={outreach} onClose={vi.fn()} onSave={vi.fn()} saving={false} />);
    expect(screen.getByText('Edit Record')).toBeInTheDocument();
  });

  it('pre-fills form fields when editing', () => {
    const outreach = { id: 1, company: 'Acme Corp', sector: 'Tech', recruiter: 'John Doe', linkedin: 'https://linkedin.com/in/john', msg_sent: '2026-07-01', reply: 'Yes', next_action: 'Follow up', created_at: '', updated_at: '' };
    render(<OutreachModal outreach={outreach} onClose={vi.fn()} onSave={vi.fn()} saving={false} />);
    expect(screen.getByDisplayValue('Acme Corp')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tech')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://linkedin.com/in/john')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-07-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Follow up')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', () => {
    render(<OutreachModal outreach={null} onClose={vi.fn()} onSave={vi.fn()} saving={false} />);
    fireEvent.click(screen.getByText('Create'));
    expect(screen.getByText('Company is required')).toBeInTheDocument();
    expect(screen.getByText('Sector is required')).toBeInTheDocument();
    expect(screen.getByText('Recruiter name is required')).toBeInTheDocument();
  });

  it('calls onClose when cancel button clicked', () => {
    const onClose = vi.fn();
    render(<OutreachModal outreach={null} onClose={onClose} onSave={vi.fn()} saving={false} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('disables submit button while saving', () => {
    render(<OutreachModal outreach={null} onClose={vi.fn()} onSave={vi.fn()} saving={true} />);
    expect(screen.getByText('Saving...')).toBeDisabled();
  });

  it('shows Update button text when editing', () => {
    const outreach = { id: 1, company: 'Acme', sector: 'Tech', recruiter: 'John', linkedin: '', msg_sent: '', reply: 'Pending', next_action: '', created_at: '', updated_at: '' };
    render(<OutreachModal outreach={outreach} onClose={vi.fn()} onSave={vi.fn()} saving={false} />);
    expect(screen.getByText('Update')).toBeInTheDocument();
  });
});
