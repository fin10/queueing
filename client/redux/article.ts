import axios from 'axios';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {
  ArticleAction,
  ArticleState,
  DISLIKE_ARTICLE,
  FETCH_ARTICLE,
  LIKE_ARTICLE,
  NoteWithBody,
  REMOVE_ARTICLE,
} from '../types';

const fetch = async (id: string): Promise<NoteWithBody> => {
  const res = await axios.get<NoteWithBody>(`/api/article/${id}`);
  return res.data;
};

export function fetchArticle(id: string): ThunkAction<void, ArticleState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    const type = FETCH_ARTICLE;
    dispatch({ type, loading: true });
    try {
      const article = await fetch(id);
      dispatch({ type, article });
    } catch (error) {
      dispatch({ type, error });
    }
  };
}

export function removeArticle(id: string): ThunkAction<void, ArticleState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    const type = REMOVE_ARTICLE;
    dispatch({ type, loading: true });
    try {
      await axios.delete(`/api/article/${id}`);
      dispatch({ type, removed: true });
    } catch (error) {
      dispatch({ type, error });
    }
  };
}

export function likeArticle(id: string): ThunkAction<void, ArticleState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    const type = LIKE_ARTICLE;
    dispatch({ type, loading: true });
    try {
      await axios.post(`/api/action/like/${id}`);
      const article = await fetch(id);
      dispatch({ type, article });
    } catch (error) {
      dispatch({ type, error });
    }
  };
}

export function dislikeArticle(id: string): ThunkAction<void, ArticleState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    const type = DISLIKE_ARTICLE;
    dispatch({ type, loading: true });
    try {
      await axios.post(`/api/action/dislike/${id}`);
      const article = await fetch(id);
      dispatch({ type, article });
    } catch (error) {
      dispatch({ type, error });
    }
  };
}

const initialState: ArticleState = {
  loading: false,
  removed: false,
};

export default function article(state = initialState, action: ArticleAction): ArticleState {
  switch (action.type) {
    case FETCH_ARTICLE:
    case REMOVE_ARTICLE:
    case LIKE_ARTICLE:
    case DISLIKE_ARTICLE:
      return {
        loading: action.loading || false,
        article: action.article || state.article,
        removed: action.removed,
        error: action.error,
      };
    default:
      return state;
  }
}
