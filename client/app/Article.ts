import axios from 'axios';
import { NoteWithBody } from '../types';

export async function fetch(id: string): Promise<NoteWithBody> {
  const res = await axios.get<NoteWithBody>(`/api/article/${id}`);
  return res.data;
}

export async function like(id: string): Promise<NoteWithBody> {
  await axios.post<{ state: boolean; count: number }>(`/api/action/like/${id}`);
  return fetch(id);
}

export async function dislike(id: string): Promise<NoteWithBody> {
  await axios.post<{ state: boolean; count: number }>(`/api/action/dislike/${id}`);
  return fetch(id);
}

export async function remove(id: string): Promise<void> {
  await axios.delete(`/api/article/${id}`);
}
