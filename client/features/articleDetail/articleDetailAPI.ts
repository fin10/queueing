import axios from 'axios';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import { StatusCodes } from 'http-status-codes';
import { BodyEntity } from '../body/NoteBody';

export interface ArticleDetail {
  readonly id: string;
  readonly topic: string;
  readonly title: string;
  readonly created: Date;
  readonly updated: Date;
  readonly expireTime: Date;
  readonly children: number;
  readonly likes: number;
  readonly dislikes: number;
  readonly user: string;
  readonly body: BodyEntity[];
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

async function create(topic: string, title: string, body: string) {
  try {
    const res = await axios.post<ArticleDetail>('/api/article', { topic, title, body });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      switch (err.response.status) {
        case StatusCodes.UNAUTHORIZED:
          throw new Error(Resources.getString(StringID.ERROR_UNAUTHORIZED));
        case StatusCodes.FORBIDDEN:
          throw new Error(Resources.getString(StringID.ERROR_FORBIDDEN_TO_CREATE_ARTICLE));
      }
    }
    throw err;
  }
}

async function update(id: string, topic: string, title: string, body: string) {
  try {
    const res = await axios.put<ArticleDetail>(`/api/article/${id}`, { topic, title, body });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      switch (err.response.status) {
        case StatusCodes.UNAUTHORIZED:
          throw new Error(Resources.getString(StringID.ERROR_UNAUTHORIZED));
        case StatusCodes.FORBIDDEN:
          throw new Error(Resources.getString(StringID.ERROR_FORBIDDEN_TO_UPDATE_ARTICLE));
      }
    }
    throw err;
  }
}

async function remove(id: string) {
  try {
    const res = await axios.delete<string>(`/api/article/${id}`);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      switch (err.response.status) {
        case StatusCodes.UNAUTHORIZED:
          throw new Error(Resources.getString(StringID.ERROR_UNAUTHORIZED));
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
  create,
  update,
  remove,
  like,
  dislike,
};
