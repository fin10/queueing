import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'client/app/store';
import ProfileApis, { Profile } from './profileAPI';

const ACTION_NAME = 'profile';

export interface ProfileState {
  readonly profile: Profile;
}

export const getProfile = createAsyncThunk(`${ACTION_NAME}/get`, async (_, { rejectWithValue }) => {
  try {
    return await ProfileApis.getProfile();
  } catch (err) {
    rejectWithValue(err);
  }
});

const initialState: ProfileState = {
  profile: undefined,
};

const profileSlice = createSlice({
  name: ACTION_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
  },
});

export const selectProfile = (state: RootState) => state.profile.profile;

export default profileSlice.reducer;
