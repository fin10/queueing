import axios from 'axios';
import qs from 'qs';
import { BodyEntity } from '../body/NoteBody';

export interface Comment {
  readonly id: string;
  readonly creator: string;
  readonly body: BodyEntity[];
  readonly created: Date;
  readonly updated: Date;
  readonly likes: number;
  readonly dislikes: number;
}

async function fetch(articleId: string) {
  const res = await axios.get<Comment[]>(`/api/comment?${qs.stringify({ articleId })}`);
  return res.data;
}

async function addComment(articleId: string, body: string) {
  const res = await axios.post<Comment>('/api/comment', { articleId, body });
  return res.data;
}

export default {
  fetch,
  addComment,
};
