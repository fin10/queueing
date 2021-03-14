import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import article from './article';
import comment from './comment';

const rootReducer = combineReducers({
  article,
  comment,
});

export default configureStore({
  reducer: rootReducer,
  middleware: [thunk, logger],
});
