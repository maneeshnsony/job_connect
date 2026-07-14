'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } else {
      router.push('/login?error=google_auth_failed');
    }
  }, [searchParams, router]);

  return (
    <p style={{ color: 'var(--text-secondary)' }}>Completing sign in...</p>
  );
}

export default function GoogleCallbackPage() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <Suspense fallback={<p style={{ color: 'var(--text-secondary)' }}>Completing sign in...</p>}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
