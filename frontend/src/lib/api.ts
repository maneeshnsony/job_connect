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
  notes_count: number;
  created_at: string;
  updated_at: string;
}

export interface OutreachNote {
  id: number;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { current_page: number; last_page: number; total: number };
}

export interface OutreachFilters {
  sort?: string;
  direction?: string;
  company?: string;
  sector?: string;
  recruiter?: string;
  reply?: string;
}

export async function getOutreaches(filters?: OutreachFilters): Promise<PaginatedResponse<Outreach>> {
  const res = await api.get('/outreaches', { params: filters });
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

export async function getOutreachNotes(outreachId: number): Promise<OutreachNote[]> {
  const res = await api.get(`/outreaches/${outreachId}/notes`);
  return res.data.data;
}

export async function createOutreachNote(outreachId: number, note: string): Promise<OutreachNote> {
  const res = await api.post(`/outreaches/${outreachId}/notes`, { note });
  return res.data;
}

export async function deleteOutreachNote(outreachId: number, noteId: number): Promise<void> {
  await api.delete(`/outreaches/${outreachId}/notes/${noteId}`);
}
