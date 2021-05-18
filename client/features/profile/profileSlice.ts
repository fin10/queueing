import { createAsyncThunk, createSlice, isPending, isRejected, SerializedError } from '@reduxjs/toolkit';
import { handleError } from '../../utils/errorUtils';
import ProfileApis from './profileApis';

export interface Profile {
  readonly name: string;
}

export interface ProfileState {
  readonly loading: boolean;
  readonly profile?: Profile;
  readonly error?: SerializedError;
}

export const getProfile = createAsyncThunk('profile/get', async () => {
  try {
    return await ProfileApis.getProfile();
  } catch (error) {
    handleError(error);
  }
});

const initialState: ProfileState = {
  loading: true,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addMatcher(
        (action) => isPending(action),
        (state) => {
          state.loading = true;
        },
      )
      .addMatcher(
        (action) => isRejected(action),
        (state, action) => {
          state.loading = false;
          state.error = action.error;
        },
      );
  },
});

export const selectProfile = (state: { profile: ProfileState }) => state.profile;

export default profileSlice.reducer;
