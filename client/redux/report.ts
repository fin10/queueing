import axios from 'axios';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AsyncState, POST_REPORT, ReportAction } from '../types';

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

const initialState: AsyncState = {
  loading: false,
};

export default function report(state = initialState, action: ReportAction): AsyncState {
  switch (action.type) {
    case POST_REPORT:
      return {
        loading: action.loading || false,
        error: action.error,
      };
    default:
      return state;
  }
}
