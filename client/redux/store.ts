import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import profile from './profile';
import notification from './notification';
import article from './article';
import comment from './comment';
import report from './report';

const rootReducer = combineReducers({
  profile,
  notification,
  article,
  comment,
  report,
});

export default configureStore({
  reducer: rootReducer,
  middleware: [thunk, logger],
});
