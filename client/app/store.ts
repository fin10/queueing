import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { useDispatch } from 'react-redux';
import notification from 'client/redux/notification';
import comment from 'client/redux/comment';
import report from 'client/redux/report';
import profileReducer from 'client/features/profile/profileSlice';
import articleSummaryReducer from 'client/features/articleSummary/articleSummarySlice';
import articleDetailReducer from 'client/features/articleDetail/articleDetailSlice';
import topicReducer from 'client/features/topic/topicSlice';

const rootReducer = combineReducers({
  profile: profileReducer,
  articleSummary: articleSummaryReducer,
  articleDetail: articleDetailReducer,
  topic: topicReducer,
  notification,
  comment,
  report,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export default store;
