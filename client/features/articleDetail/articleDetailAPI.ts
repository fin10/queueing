import axios from 'axios';

export const enum EntityType {
  STRING = 'string',
  IMAGE = 'image',
  VIDEO = 'video',
  YOUTUBE = 'youtube',
  LINK = 'link',
}

export interface ArticleBodyEntity {
  readonly type: EntityType;
  readonly value: string;
}

export interface ArticleDetail {
  readonly id: string;
  readonly topic: string;
  readonly title: string;
  readonly created: Date;
  readonly updated: Date;
  readonly expireTime: Date;
  readonly children: number;
  readonly like: number;
  readonly dislike: number;
  readonly user: string;
  readonly body: ArticleBodyEntity[];
}

export interface EmotionActionResponse {
  readonly id: string;
  readonly likes: number;
  readonly dislikes: number;
}

async function fetch(id: string) {
  const res = await axios.get<ArticleDetail>(`/api/article/${id}`);
  return res.data;
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
  fetch,
  like,
  dislike,
};
