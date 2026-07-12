'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/axios';

export default function VerifyEmailPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sending, setSending] = useState(false);

  async function handleResend() {
    setSending(true);
    try {
      await api.post('/email/verification-notification');
      toast.success('Verification link sent! Check your inbox.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-secondary)' }}>
      <div className="w-full max-w-md rounded-xl shadow-lg border p-8 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        </div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Verify your email</h1>
        <p className="text-sm mt-2 mb-6" style={{ color: 'var(--text-secondary)' }}>
          We sent a verification link to <strong style={{ color: 'var(--text-primary)' }}>{user?.email}</strong>.
        </p>
        <div className="space-y-3">
          <button onClick={handleResend} disabled={sending} className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium text-white transition">
            {sending ? 'Sending...' : 'Resend verification email'}
          </button>
          <button onClick={() => { logout(); router.push('/login'); }} className="w-full py-2 px-4 rounded-lg text-sm font-medium transition" style={{ color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
