import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { useDispatch } from 'react-redux';
import notification from '../redux/notification';
import article from '../redux/article';
import comment from '../redux/comment';
import report from '../redux/report';
import profileReducer from '../features/profile/profileSlice';
import articlesReducer from '../features/articles/articlesSlice';

const rootReducer = combineReducers({
  profile: profileReducer,
  articles: articlesReducer,
  notification,
  article,
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
