'use client';

import { Outreach } from '@/lib/api';

interface Props {
  outreach: Outreach;
  onClose: () => void;
  onConfirm: () => void;
  saving: boolean;
}

export default function DeleteConfirmModal({ outreach, onClose, onConfirm, saving }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-900/50 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Delete Record</h3>
          <p className="text-gray-400 text-sm mb-6">
            Are you sure you want to delete the outreach record for <strong className="text-white">{outreach.company}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={saving} className="flex-1 py-2.5 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-white transition disabled:opacity-50">Cancel</button>
            <button onClick={onConfirm} disabled={saving} className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-white transition disabled:opacity-50">
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
