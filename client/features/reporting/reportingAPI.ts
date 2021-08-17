import axios from 'axios';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import { StatusCodes } from 'http-status-codes';

export const enum ReportTypeCode {
  RUDE = 'rude',
  AD = 'ad',
  LEWD = 'lewd',
  ILLEGAL = 'illegal',
  COPYRIGHT = 'copyright',
  PLASTERED = 'plastered',
}

export interface ReportType {
  readonly code: ReportTypeCode;
  readonly text: string;
}

async function fetchReportTypes() {
  const res = await axios.get<ReportType[]>(`/api/report/types`);
  return res.data;
}

async function report(id: string, type: ReportTypeCode) {
  try {
    const res = await axios.post(`/api/report`, { targetId: id, type });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      switch (err.response.status) {
        case StatusCodes.UNAUTHORIZED:
          throw new Error(Resources.getString(StringID.ERROR_UNAUTHORIZED));
      }
    }
    throw err;
  }
}

export default {
  fetchReportTypes,
  report,
};
