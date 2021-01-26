import axios from 'axios';
import { NoteWithBody } from '../types';

export async function fetch(id: string): Promise<NoteWithBody> {
  const res = await axios.get<NoteWithBody>(`/api/article/${id}`);
  return res.data;
}

export async function like(id: string): Promise<void> {
  await axios.post<{ state: boolean; count: number }>(`/api/action/like/${id}`);
}

export async function remove(id: string): Promise<void> {
  await axios.delete(`/api/article/${id}`);
}
