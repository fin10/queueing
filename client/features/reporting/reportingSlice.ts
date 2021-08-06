import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'client/app/store';
import reportingAPI, { ReportType } from './reportingAPI';

const ACTION_NAME = 'reporting';

export interface reportingState {
  readonly types: ReportType[];
}

export const fetchReportTypes = createAsyncThunk(`${ACTION_NAME}/fetch`, async (_, { rejectWithValue }) => {
  try {
    return await reportingAPI.fetchReportTypes();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState: reportingState = {
  types: [],
};

const articleDetailSlice = createSlice({
  name: ACTION_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReportTypes.fulfilled, (state, action) => {
      state.types = action.payload;
    });
  },
});

export const selectReportTypes = (state: RootState) => state.reporting.types;

export default articleDetailSlice.reducer;
