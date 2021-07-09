import axios from 'axios';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import { StatusCodes } from 'http-status-codes';

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

export interface ActionResponse {
  readonly id: string;
}

export interface EmotionActionResponse extends ActionResponse {
  readonly likes: number;
  readonly dislikes: number;
}

async function fetch(id: string) {
  const res = await axios.get<ArticleDetail>(`/api/article/${id}`);
  return res.data;
}

async function remove(id: string) {
  try {
    const res = await axios.delete<ActionResponse>(`/api/article/${id}`);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      switch (err.response.status) {
        case StatusCodes.FORBIDDEN:
          throw new Error(Resources.getString(StringID.ERROR_FORBIDDEN_TO_REMOVE_ARTICLE));
      }
    }
    throw err;
  }
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
  remove,
  like,
  dislike,
};
