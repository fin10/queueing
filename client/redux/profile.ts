import axios from 'axios';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { GET_PROFILE, Profile, ProfileAction, ProfileState } from '../types';

export function getProfile(): ThunkAction<void, ProfileState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    const type = GET_PROFILE;
    dispatch({ type, loading: true });
    try {
      const res = await axios.get<Profile>('/api/profile');
      dispatch({ type, profile: res.data });
    } catch (error) {
      dispatch({ type, error });
    }
  };
}

const initialState: ProfileState = {
  loading: false,
};

export default function profile(state = initialState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case GET_PROFILE:
      return {
        loading: action.loading || false,
        profile: action.profile || state.profile,
        error: action.error,
      };
    default:
      return state;
  }
}
