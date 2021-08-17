import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { useDispatch } from 'react-redux';
import notification from 'client/redux/notification';
import report from 'client/redux/report';
import profileReducer from 'client/features/profile/profileSlice';
import articleSummaryReducer from 'client/features/articleSummary/articleSummarySlice';
import articleDetailReducer from 'client/features/articleDetail/articleDetailSlice';
import commentsReducer from 'client/features/comments/commentsSlice';
import topicReducer from 'client/features/topic/topicSlice';
import reportingReducer from 'client/features/reporting/reportingSlice';

const rootReducer = combineReducers({
  profile: profileReducer,
  articleSummary: articleSummaryReducer,
  articleDetail: articleDetailReducer,
  comments: commentsReducer,
  topic: topicReducer,
  reporting: reportingReducer,
  notification,
  report,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export default store;
