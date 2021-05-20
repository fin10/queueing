import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import ProfileApis, { Profile } from './profileApis';

const ACTION_NAME = 'profile';

export interface ProfileState {
  readonly loading: boolean;
  readonly profile?: Profile;
  readonly error?: SerializedError;
}

export const getProfile = createAsyncThunk(`${ACTION_NAME}/get`, () => {
  return ProfileApis.getProfile();
});

const initialState: ProfileState = {
  loading: true,
};

const profileSlice = createSlice({
  name: ACTION_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const selectProfile = (state: { profile: ProfileState }) => state.profile;

export default profileSlice.reducer;
