import axios from 'axios';

export interface Topic {
  readonly name: string;
  readonly count: number;
}

async function fetch() {
  const res = await axios.get<Topic[]>(`/api/topic`);
  return res.data;
}

export default {
  fetch,
};
