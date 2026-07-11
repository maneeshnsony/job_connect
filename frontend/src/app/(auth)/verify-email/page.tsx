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

  async function handleCheckVerification() {
    try {
      const res = await api.get('/user');
      if (res.data.email_verified_at) {
        toast.success('Email verified!');
        router.push('/dashboard');
      } else {
        toast.info('Email not verified yet');
      }
    } catch {
      toast.error('Could not check verification status');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-white mb-2">Verify your email</h1>
        <p className="text-gray-400 mb-6">
          We sent a verification link to <strong className="text-white">{user?.email}</strong>. Click the link to activate your account.
        </p>
        <div className="space-y-3">
          <button onClick={handleResend} disabled={sending} className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium text-white transition">
            {sending ? 'Sending...' : 'Resend verification email'}
          </button>
          <button onClick={handleCheckVerification} className="w-full py-2.5 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-white transition">
            I&apos;ve verified my email
          </button>
          <button onClick={() => { logout(); router.push('/login'); }} className="w-full py-2 px-4 text-gray-400 hover:text-white text-sm transition">
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
