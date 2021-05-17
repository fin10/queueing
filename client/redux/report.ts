import axios from 'axios';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AsyncState, GET_REPORT_TYPES, POST_REPORT, ReportAction, ReportState } from '../types';

export function postReport(
  id: string,
  reportType: string,
  onReported?: () => void,
): ThunkAction<void, AsyncState, unknown, Action<string>> {
  return async (dispatch): Promise<void> => {
    const type = POST_REPORT;
    dispatch({ type, loading: true });
    try {
      await axios.post(`/api/action/report/${id}/${reportType}`);
      dispatch({ type, loading: false });
      if (onReported) onReported();
    } catch (error) {
      dispatch({ type, error });
    }
  };
}

export function getReportTypes(): ThunkAction<void, ReportState, unknown, Action<string>> {
  return async (dispatch) => {
    const type = GET_REPORT_TYPES;
    dispatch({ type, loading: true });
    try {
      const res = await axios.get(`/api/action/report/types`);
      dispatch({ type, loading: false, reportTypes: res.data });
    } catch (error) {
      dispatch({ type, error });
    }
  };
}

const initialState: ReportState = {
  loading: false,
  reportTypes: [],
};

export default function report(state = initialState, action: ReportAction): ReportState {
  switch (action.type) {
    case POST_REPORT:
      return {
        loading: action.loading || false,
        reportTypes: state.reportTypes,
        error: action.error,
      };
    case GET_REPORT_TYPES:
      return {
        loading: action.loading || false,
        reportTypes: action.reportTypes || state.reportTypes,
        error: action.error,
      };
    default:
      return state;
  }
}
