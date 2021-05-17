import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  TextField,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import { ReportState } from 'client/types';
import { getReportTypes } from 'client/redux/report';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

const PenaltyUserPage = (): React.ReactElement => {
  const query = new URLSearchParams(useLocation().search);
  const userId = query.get('userId');
  const duration = query.get('duration');

  const reportTypesState = useSelector<{ report: ReportState }, ReportState>((state) => state.report);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReportTypes());
  }, [dispatch]);

  if (reportTypesState.error) console.error(reportTypesState.error.stack);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          User Penalty
        </Typography>
        <Typography variant="body2" component="p">
          <TextField required id="standard-required" label="User ID" defaultValue={userId} />

          <FormControl>
            <InputLabel id="report-type-label">Report Types</InputLabel>
            <Select labelId="report-type-label" id="report-types" multiple input={<Input />}>
              {reportTypesState.reportTypes.map((type) => (
                <MenuItem key={type.code} value={type.code}>
                  {type.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Cancel
        </Button>
        <Button size="small" color="primary">
          Apply
        </Button>
      </CardActions>
    </Card>
  );
};

export default PenaltyUserPage;
