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

function reportArticle(id: string, type: ReportTypeCode) {
  return report('/api/report/article', id, type);
}

function reportComment(id: string, type: ReportTypeCode) {
  return report('/api/report/comment', id, type);
}

async function report(url: string, id: string, type: ReportTypeCode) {
  try {
    const res = await axios.post(url, { targetId: id, type });
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
  reportArticle,
  reportComment,
};
