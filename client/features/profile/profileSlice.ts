import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import * as ProfileApis from './profileApis';

export interface ProfileState {
  readonly loading: boolean;
  readonly error?: SerializedError;
  readonly profile?: ProfileApis.Profile;
}

export const getProfile = createAsyncThunk('profile/get', async () => {
  return ProfileApis.getProfile();
});

const initialState: ProfileState = {
  loading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default profileSlice.reducer;
