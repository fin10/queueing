import axios from 'axios';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import { StatusCodes } from 'http-status-codes';

export interface ActionResponse {
  readonly id: string;
}

export interface EmotionActionResponse extends ActionResponse {
  readonly likes: number;
  readonly dislikes: number;
}

async function like(id: string) {
  try {
    const res = await axios.post<EmotionActionResponse>(`/api/action/like/${id}`);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      switch (err.response.status) {
        case StatusCodes.UNAUTHORIZED:
          throw new Error(Resources.getString(StringID.ERROR_UNAUTHORIZED));
      }
    }
    throw err;
  }
}

async function dislike(id: string) {
  try {
    const res = await axios.post<EmotionActionResponse>(`/api/action/dislike/${id}`);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      switch (err.response.status) {
        case StatusCodes.UNAUTHORIZED:
          throw new Error(Resources.getString(StringID.ERROR_UNAUTHORIZED));
      }
    }
    throw err;
  }
}

export default {
  like,
  dislike,
};
