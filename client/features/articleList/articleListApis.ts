import axios from 'axios';
import qs from 'qs';
import { handleError } from '../../utils/errorUtils';

export interface ArticleSummary {
  readonly id: string;
  readonly topic: string;
  readonly title: string;
  readonly created: Date;
  readonly updated: Date;
  readonly expireTime: Date;
  readonly children: number;
  readonly like: number;
  readonly dislike: number;
  readonly user: string;
}

export interface ArticleList {
  readonly page: number;
  readonly totalPages: number;
  readonly notes: ArticleSummary[];
}

async function fetchArticles(page: number) {
  try {
    const query = qs.stringify({ page });
    const res = await axios.get<ArticleList>(`/api/article?${query}`);
    return res.data;
  } catch (err) {
    handleError(err);
  }
}

export default {
  fetchArticles,
};
