import axios from 'axios';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import { StatusCodes } from 'http-status-codes';
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
  try {
    const res = await axios.post<Comment>('/api/comment', { articleId, body });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      switch (err.response.status) {
        case StatusCodes.UNAUTHORIZED:
          throw new Error(Resources.getString(StringID.ERROR_UNAUTHORIZED));
        case StatusCodes.FORBIDDEN:
          throw new Error(Resources.getString(StringID.ERROR_FORBIDDEN_TO_CREATE_COMMENT));
      }
    }
    throw err;
  }
}

async function removeComment(id: string) {
  try {
    const res = await axios.delete<string>(`/api/comment/${id}`);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      switch (err.response.status) {
        case StatusCodes.UNAUTHORIZED:
          throw new Error(Resources.getString(StringID.ERROR_UNAUTHORIZED));
        case StatusCodes.FORBIDDEN:
          throw new Error(Resources.getString(StringID.ERROR_FORBIDDEN_TO_DELETE_COMMENT));
      }
    }
    throw err;
  }
}

export default {
  fetch,
  addComment,
  removeComment,
};
