import { configureStore } from '@reduxjs/toolkit';
import { ArticleAction, ArticleState } from '../types';
import article from './article';

export default configureStore<{ article: ArticleState }, ArticleAction>({
  reducer: {
    article,
  },
});
