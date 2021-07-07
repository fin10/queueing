import axios from 'axios';
import qs from 'qs';

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

export interface ArticleSummaryResponse {
  readonly page: number;
  readonly totalPages: number;
  readonly notes: ArticleSummary[];
}

async function fetch(page: number) {
  const query = qs.stringify({ page });
  const res = await axios.get<ArticleSummaryResponse>(`/api/article?${query}`);
  return res.data;
}

export default {
  fetch,
};
