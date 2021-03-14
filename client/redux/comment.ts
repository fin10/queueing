import axios from 'axios';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import {
  ADD_COMMENT,
  CommentAction,
  CommentState,
  DISLIKE_COMMENT,
  FETCH_COMMENTS,
  LIKE_COMMENT,
  NoteWithBody,
  REMOVE_COMMENT,
} from '../types';

const fetch = async (id: string): Promise<NoteWithBody> => {
  const res = await axios.get<NoteWithBody>(`/api/comment/${id}`);
  return res.data;
};

export function fetchComments(parentId: string): ThunkAction<void, CommentState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    dispatch({ type: FETCH_COMMENTS, loading: true });
    try {
      const res = await axios.get<NoteWithBody[]>(`/api/comment/article/${parentId}`);
      const comments = res.data;
      dispatch({ type: FETCH_COMMENTS, comments });
    } catch (error) {
      dispatch({ type: FETCH_COMMENTS, error });
    }
  };
}

export function addComment(
  parentId: string,
  body: string,
  onAdded: { (): void },
): ThunkAction<void, CommentState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    const type = ADD_COMMENT;
    dispatch({ type, loading: true });
    try {
      const res = await axios.post<string>('/api/comment', { body, parentId });
      const comment = await fetch(res.data);
      dispatch({ type, comment });
      onAdded();
    } catch (error) {
      dispatch({ type, error });
    }
  };
}

export function removeComment(id: string): ThunkAction<void, CommentState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    dispatch({ type: REMOVE_COMMENT, loading: true });
    try {
      await axios.delete(`/api/comment/${id}`);
      dispatch({ type: REMOVE_COMMENT, removedId: id });
    } catch (error) {
      dispatch({ type: REMOVE_COMMENT, error });
    }
  };
}

export function likeComment(id: string): ThunkAction<void, CommentState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    dispatch({ type: LIKE_COMMENT, loading: true });
    try {
      await axios.post<{ state: boolean; count: number }>(`/api/action/like/${id}`);
      const comment = await fetch(id);
      dispatch({ type: LIKE_COMMENT, comment });
    } catch (error) {
      dispatch({ type: LIKE_COMMENT, error });
    }
  };
}

export function dislikeComment(id: string): ThunkAction<void, CommentState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    dispatch({ type: DISLIKE_COMMENT, loading: true });
    try {
      await axios.post<{ state: boolean; count: number }>(`/api/action/dislike/${id}`);
      const comment = await fetch(id);
      dispatch({ type: DISLIKE_COMMENT, comment });
    } catch (error) {
      dispatch({ type: DISLIKE_COMMENT, error });
    }
  };
}

const initialState: CommentState = {
  loading: false,
  comments: [],
};

export default function comment(state = initialState, action: CommentAction): CommentState {
  switch (action.type) {
    case FETCH_COMMENTS:
      return {
        loading: action.loading || false,
        comments: action.comments || state.comments,
        error: action.error,
      };
    case ADD_COMMENT:
      return {
        loading: action.loading || false,
        comments: state.comments.concat(action.comment || []),
        error: action.error,
      };
    case REMOVE_COMMENT:
      return {
        loading: action.loading || false,
        comments: state.comments.filter((c) => c.id !== action.removedId),
        error: action.error,
      };
    case LIKE_COMMENT:
    case DISLIKE_COMMENT:
      return {
        loading: action.loading || false,
        comments: state.comments.map((c) => (c.id === action.comment?.id ? action.comment : c)),
        error: action.error,
      };
    default:
      return state;
  }
}
