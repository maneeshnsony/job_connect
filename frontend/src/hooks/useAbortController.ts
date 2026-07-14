'use client';

import { useRef, useEffect } from 'react';

export function useAbortController() {
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  function getSignal(): AbortSignal {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    return abortRef.current.signal;
  }

  return { getSignal, abortRef };
}
