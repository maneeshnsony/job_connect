'use client';

import { useEffect } from 'react';

export function WebVitals() {
  useEffect(() => {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('[Web Vitals] LCP:', entry.startTime, 'ms');
          }
          if (entry.entryType === 'first-input') {
            const fiEntry = entry as PerformanceEventTiming;
            console.log('[Web Vitals] FID:', fiEntry.processingStart - fiEntry.startTime, 'ms');
          }
          if (entry.entryType === 'layout-shift') {
            console.log('[Web Vitals] CLS:', (entry as unknown as { value: number }).value);
          }
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true } as PerformanceObserverInit);
      observer.observe({ type: 'first-input', buffered: true } as PerformanceObserverInit);
      observer.observe({ type: 'layout-shift', buffered: true } as PerformanceObserverInit);

      return () => observer.disconnect();
    } catch {
      // Web Vitals not supported
    }
  }, []);

  return null;
}
