import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import { ContentsEntity } from 'client/common/Contents';

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
  readonly creator: string;
  readonly body: ContentsEntity[];
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

export default {
  fetch,
  create,
  update,
  remove,
};
