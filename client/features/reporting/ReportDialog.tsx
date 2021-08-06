import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, Button, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { Resources } from '../../resources/Resources';
import { StringID } from '../../resources/StringID';
import { fetchReportTypes, selectReportTypes } from './reportingSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { Logger } from 'client/utils/Logger';
import { useAppDispatch } from 'client/app/store';
import { useSelector } from 'react-redux';

interface PropTypes {
  readonly id: string;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onReportClick: (elm: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function ReportDialog({ id, open, onClose, onReportClick }: PropTypes) {
  const [type, updateType] = React.useState<string>('');
  const types = useSelector(selectReportTypes);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchReportTypes())
      .then(unwrapResult)
      .catch((err) => Logger.error(err));
  }, [dispatch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateType(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent>
        <RadioGroup name="reportType" value={type} onChange={handleChange}>
          {types.map((type) => (
            <FormControlLabel key={type.code} value={type.code} control={<Radio />} label={type.text} />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {Resources.getString(StringID.ACTION_CANCEL)}
        </Button>
        <Button id={id} onClick={onReportClick} color="primary" autoFocus>
          {Resources.getString(StringID.ACTION_REPORT)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
