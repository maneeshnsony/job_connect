'use client';

import { Outreach, OutreachFilters } from '@/lib/api';

interface Props {
  data: Outreach[];
  isLoading: boolean;
  error: Error | null;
  filters: OutreachFilters;
  onFilterChange: (filters: OutreachFilters) => void;
  onEdit: (outreach: Outreach) => void;
  onDelete: (outreach: Outreach) => void;
}

const COLUMNS = [
  { key: 'company', label: 'Company' },
  { key: 'sector', label: 'Sector' },
  { key: 'recruiter', label: 'Recruiter' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'msg_sent', label: 'Msg Sent' },
  { key: 'reply', label: 'Reply?' },
  { key: 'next_action', label: 'Next Action' },
];

export default function OutreachTable({ data, isLoading, error, filters, onFilterChange, onEdit, onDelete }: Props) {
  function toggleSort(key: string) {
    if (filters.sort === key) {
      onFilterChange({ ...filters, direction: filters.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      onFilterChange({ ...filters, sort: key, direction: 'asc' });
    }
  }

  function setFilter(key: string, value: string) {
    onFilterChange({ ...filters, [key]: value || undefined });
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-center gap-3 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <svg className="w-5 h-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Loading outreach records...</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                <th className="px-4 py-3 text-left">#</th>
                {COLUMNS.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left">{col.label}</th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="animate-pulse">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3"><div className="h-4 w-6 rounded" style={{ background: 'var(--bg-input)' }} /></td>
                  {[...Array(COLUMNS.length)].map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 rounded" style={{ background: 'var(--bg-input)', width: `${60 + Math.random() * 40}%` }} /></td>
                  ))}
                  <td className="px-4 py-3"><div className="h-4 w-16 rounded ml-auto" style={{ background: 'var(--bg-input)' }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border p-6 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <p className="text-red-500 font-medium">Failed to load outreach records.</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{error.message}</p>
      </div>
    );
  }

  const hasFilters = !!(filters.company || filters.sector || filters.recruiter || filters.reply);

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <th className="px-4 py-3 text-left w-12">#</th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition"
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {filters.sort === col.key && (
                      <svg className={`w-3 h-3 transition-transform ${filters.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/></svg>
                    )}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-right w-24">Actions</th>
            </tr>
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2"><input placeholder="Filter..." value={filters.company || ''} onChange={(e) => setFilter('company', e.target.value)} className="w-full px-2 py-1 rounded text-xs border focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ background: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} /></td>
              <td className="px-4 py-2"><input placeholder="Filter..." value={filters.sector || ''} onChange={(e) => setFilter('sector', e.target.value)} className="w-full px-2 py-1 rounded text-xs border focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ background: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} /></td>
              <td className="px-4 py-2"><input placeholder="Filter..." value={filters.recruiter || ''} onChange={(e) => setFilter('recruiter', e.target.value)} className="w-full px-2 py-1 rounded text-xs border focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ background: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} /></td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2">
                <select value={filters.reply || ''} onChange={(e) => setFilter('reply', e.target.value)} className="w-full px-2 py-1 rounded text-xs border focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ background: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Pending">Pending</option>
                </select>
              </td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2"></td>
            </tr>
          </thead>
          {data.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={COLUMNS.length + 2} className="px-4 py-12 text-center">
                  <svg className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  <h3 className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {hasFilters ? 'No matching records' : 'No outreach records yet'}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {hasFilters ? 'Try adjusting your filters above.' : 'Click "Add New" to create your first record.'}
                  </p>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {data.map((outreach, idx) => (
                <tr key={outreach.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{outreach.company}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{outreach.sector}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{outreach.recruiter}</td>
                  <td className="px-4 py-3">
                    {outreach.linkedin ? (
                      <a href={outreach.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        Profile
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{outreach.msg_sent || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      outreach.reply === 'Yes' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      outreach.reply === 'No' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {outreach.reply || 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate" style={{ color: 'var(--text-secondary)' }}>{outreach.next_action || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onEdit(outreach)} className="p-1.5 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700" style={{ color: 'var(--text-muted)' }} title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button onClick={() => onDelete(outreach)} className="p-1.5 rounded-lg transition hover:bg-red-50 dark:hover:bg-red-900/20" style={{ color: 'var(--text-muted)' }} title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
