'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOutreachNotes, createOutreachNote, deleteOutreachNote } from '@/lib/api';
import { toast } from 'sonner';

interface Props {
  outreachId: number;
  onClose: () => void;
}

export default function OutreachNoteModal({ outreachId, onClose }: Props) {
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['outreach-notes', outreachId],
    queryFn: () => getOutreachNotes(outreachId),
  });

  const createMutation = useMutation({
    mutationFn: (note: string) => createOutreachNote(outreachId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach-notes', outreachId] });
      queryClient.invalidateQueries({ queryKey: ['outreaches'] });
      setNewNote('');
      toast.success('Note added');
    },
    onError: () => toast.error('Failed to add note'),
  });

  const deleteMutation = useMutation({
    mutationFn: (noteId: number) => deleteOutreachNote(outreachId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach-notes', outreachId] });
      queryClient.invalidateQueries({ queryKey: ['outreaches'] });
      setConfirmingDelete(null);
      toast.success('Note deleted');
    },
    onError: () => toast.error('Failed to delete note'),
  });

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl" style={{ background: 'var(--bg-card)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Notes</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }} className="hover:opacity-80 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="mb-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note..."
            rows={3}
            className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ background: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => { if (newNote.trim()) createMutation.mutate(newNote.trim()); }}
              disabled={!newNote.trim() || createMutation.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium text-white transition text-sm"
            >
              {createMutation.isPending ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
              No notes yet
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-3 rounded-xl border" style={{ background: 'var(--bg-input)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{note.note}</p>
                  {confirmingDelete === note.id ? (
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => deleteMutation.mutate(note.id)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        title="Confirm delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                      </button>
                      <button
                        onClick={() => setConfirmingDelete(null)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        style={{ color: 'var(--text-muted)' }}
                        title="Cancel"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingDelete(note.id)}
                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition shrink-0"
                      style={{ color: 'var(--text-muted)' }}
                      title="Delete note"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  )}
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatDate(note.created_at)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
