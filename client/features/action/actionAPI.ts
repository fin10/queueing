import axios from 'axios';

export interface ActionResponse {
  readonly id: string;
}

export interface EmotionActionResponse extends ActionResponse {
  readonly likes: number;
  readonly dislikes: number;
}

async function like(id: string) {
  const res = await axios.post<EmotionActionResponse>(`/api/action/like/${id}`);
  return res.data;
}

async function dislike(id: string) {
  const res = await axios.post<EmotionActionResponse>(`/api/action/dislike/${id}`);
  return res.data;
}

export default {
  like,
  dislike,
};
