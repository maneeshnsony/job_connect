import { describe, it, expect, beforeEach } from 'vitest';
import { mockLocalStorage } from './mocks';

function getErrorMessage(err: unknown, fallback: string): string {
  const axiosErr = err as { response?: { data?: { message?: string } } };
  return axiosErr?.response?.data?.message || (err instanceof Error ? err.message : fallback);
}

describe('API error handling', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('localStorage token management', () => {
    expect(mockLocalStorage.getItem('token')).toBeNull();
    mockLocalStorage.setItem('token', 'test-token');
    expect(mockLocalStorage.getItem('token')).toBe('test-token');
    mockLocalStorage.removeItem('token');
    expect(mockLocalStorage.getItem('token')).toBeNull();
  });

  it('handles missing token gracefully', () => {
    expect(mockLocalStorage.getItem('token')).toBeNull();
    mockLocalStorage.removeItem('token');
    expect(mockLocalStorage.getItem('token')).toBeNull();
  });

  it('handles corrupted token gracefully', () => {
    mockLocalStorage.setItem('token', '');
    expect(mockLocalStorage.getItem('token')).toBe('');
    mockLocalStorage.removeItem('token');
    expect(mockLocalStorage.getItem('token')).toBeNull();
  });

  it('getErrorMessage extracts server message', () => {
    const serverError = { response: { data: { message: 'Server says no' } } };
    expect(getErrorMessage(serverError, 'Fallback')).toBe('Server says no');
    expect(getErrorMessage(new Error('Network fail'), 'Fallback')).toBe('Network fail');
    expect(getErrorMessage({}, 'Fallback')).toBe('Fallback');
  });
});
