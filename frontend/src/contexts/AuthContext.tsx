'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/axios';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  google_id?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchUser(t?: string) {
    try {
      const headers = { Authorization: `Bearer ${t || token}` };
      const res = await api.get('/user', { headers });
      setUser(res.data);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await api.post('/login', { email, password });
    const { user: u, token: t } = res.data;
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
  }

  async function register(name: string, email: string, password: string, passwordConfirmation: string) {
    const res = await api.post('/register', { name, email, password, password_confirmation: passwordConfirmation });
    const { user: u, token: t } = res.data;
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
  }

  async function logout() {
    await api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchUser: () => fetchUser() }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
