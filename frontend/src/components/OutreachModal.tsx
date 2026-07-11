'use client';

import { useState, useEffect } from 'react';
import { Outreach } from '@/lib/api';
import { toast } from 'sonner';

interface Props {
  outreach: Outreach | null;
  onClose: () => void;
  onSave: (data: Partial<Outreach>) => void;
  saving: boolean;
}

export default function OutreachModal({ outreach, onClose, onSave, saving }: Props) {
  const [company, setCompany] = useState('');
  const [sector, setSector] = useState('');
  const [recruiter, setRecruiter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [msgSent, setMsgSent] = useState('');
  const [reply, setReply] = useState('Pending');
  const [nextAction, setNextAction] = useState('');

  useEffect(() => {
    if (outreach) {
      setCompany(outreach.company || '');
      setSector(outreach.sector || '');
      setRecruiter(outreach.recruiter || '');
      setLinkedin(outreach.linkedin || '');
      setMsgSent(outreach.msg_sent || '');
      setReply(outreach.reply || 'Pending');
      setNextAction(outreach.next_action || '');
    }
  }, [outreach]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!company.trim()) errs.company = 'Company is required';
    if (!sector.trim()) errs.sector = 'Sector is required';
    if (!recruiter.trim()) errs.recruiter = 'Recruiter name is required';
    if (linkedin && !linkedin.startsWith('http')) errs.linkedin = 'LinkedIn URL must start with http';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      company: company.trim(),
      sector: sector.trim(),
      recruiter: recruiter.trim(),
      linkedin: linkedin || null,
      msg_sent: msgSent || null,
      reply,
      next_action: nextAction || null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{outreach ? 'Edit Record' : 'Add New Record'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Company *</label>
              <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sector *</label>
              <input value={sector} onChange={(e) => setSector(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.sector && <p className="text-red-400 text-xs mt-1">{errors.sector}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Recruiter *</label>
            <input value={recruiter} onChange={(e) => setRecruiter(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.recruiter && <p className="text-red-400 text-xs mt-1">{errors.recruiter}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn URL</label>
              <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.linkedin && <p className="text-red-400 text-xs mt-1">{errors.linkedin}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Msg Sent Date</label>
              <input type="date" value={msgSent} onChange={(e) => setMsgSent(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Reply?</label>
              <select value={reply} onChange={(e) => setReply(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Pending">Pending</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Next Action</label>
              <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-white transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium text-white transition">
              {saving ? 'Saving...' : outreach ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
