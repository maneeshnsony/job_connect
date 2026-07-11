import api from './axios';

export interface Outreach {
  id: number;
  company: string;
  sector: string;
  recruiter: string;
  linkedin: string | null;
  msg_sent: string | null;
  reply: string | null;
  next_action: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { current_page: number; last_page: number; total: number };
}

export async function getOutreaches(): Promise<PaginatedResponse<Outreach>> {
  const res = await api.get('/outreaches');
  return res.data;
}

export async function getOutreach(id: number): Promise<Outreach> {
  const res = await api.get(`/outreaches/${id}`);
  return res.data;
}

export async function createOutreach(data: Partial<Outreach>): Promise<Outreach> {
  const res = await api.post('/outreaches', data);
  return res.data;
}

export async function updateOutreach(id: number, data: Partial<Outreach>): Promise<Outreach> {
  const res = await api.put(`/outreaches/${id}`, data);
  return res.data;
}

export async function deleteOutreach(id: number): Promise<void> {
  await api.delete(`/outreaches/${id}`);
}
