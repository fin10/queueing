import axios from 'axios';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { GET_NOTIFICATIONS, NotificationAction, NotificationState } from '../types';

export function getNotifications(): ThunkAction<void, NotificationState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    const type = GET_NOTIFICATIONS;
    dispatch({ type, loading: true });
    try {
      const res = await axios.get<Notification[]>('/api/notification');
      dispatch({ type, notifications: res.data });
    } catch (error) {
      dispatch({ type, error });
    }
  };
}

const initialState: NotificationState = {
  loading: false,
  notifications: [],
};

export default function notification(state = initialState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      return {
        loading: action.loading || false,
        notifications: action.notifications || state.notifications,
        error: action.error,
      };
    default:
      return state;
  }
}
