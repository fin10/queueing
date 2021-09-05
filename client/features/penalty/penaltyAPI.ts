import axios from 'axios';
import { ReportTypeCode } from '../reporting/reportingAPI';

export interface Penalty {
  readonly type: ReportTypeCode;
  readonly term: number;
}

async function fetchPenalties(userId: string) {
  const res = await axios.get<Penalty[]>(`/api/penalty/${userId}`);
  return res.data;
}

export default {
  fetchPenalties,
};
