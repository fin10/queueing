import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { useDispatch } from 'react-redux';
import notification from '../redux/notification';
import article from '../redux/article';
import comment from '../redux/comment';
import report from '../redux/report';
import profileReducer from '../features/profile/profileSlice';
import articleListReducer from '../features/articleList/articleListSlice';

const rootReducer = combineReducers({
  profile: profileReducer,
  articleList: articleListReducer,
  notification,
  article,
  comment,
  report,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
