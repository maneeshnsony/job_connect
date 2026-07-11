'use client';

import { Outreach } from '@/lib/api';

interface Props {
  data: Outreach[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (outreach: Outreach) => void;
  onDelete: (outreach: Outreach) => void;
}

export default function OutreachTable({ data, isLoading, error, onEdit, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 text-center">
        <p className="text-red-400">Failed to load outreach records.</p>
        <p className="text-red-300 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <h3 className="text-lg font-medium text-gray-400 mb-1">No outreach records yet</h3>
        <p className="text-gray-500 text-sm">Click &quot;Add New&quot; to create your first record.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs tracking-wider">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Sector</th>
              <th className="px-4 py-3 text-left">Recruiter</th>
              <th className="px-4 py-3 text-left">LinkedIn</th>
              <th className="px-4 py-3 text-left">Msg Sent</th>
              <th className="px-4 py-3 text-left">Reply?</th>
              <th className="px-4 py-3 text-left">Next Action</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {data.map((outreach, idx) => (
              <tr key={outreach.id} className="hover:bg-gray-700/30 transition">
                <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                <td className="px-4 py-3 font-medium text-white">{outreach.company}</td>
                <td className="px-4 py-3 text-gray-300">{outreach.sector}</td>
                <td className="px-4 py-3 text-gray-300">{outreach.recruiter}</td>
                <td className="px-4 py-3">
                  {outreach.linkedin ? (
                    <a href={outreach.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      Profile
                    </a>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-300">{outreach.msg_sent || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    outreach.reply === 'Yes' ? 'bg-green-900/50 text-green-400' :
                    outreach.reply === 'No' ? 'bg-red-900/50 text-red-400' :
                    'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {outreach.reply || 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300 max-w-[200px] truncate">{outreach.next_action || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onEdit(outreach)} className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button onClick={() => onDelete(outreach)} className="p-1.5 hover:bg-red-900/50 rounded-lg text-gray-400 hover:text-red-400 transition" title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
