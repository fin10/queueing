import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { Resources } from '../../resources/Resources';
import { StringID } from '../../resources/StringID';
import { selectReportTypes } from './reportingSlice';
import { useSelector } from 'react-redux';
import { ReportTypeCode } from './reportingAPI';

interface PropTypes {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onReportingSubmit: (type: ReportTypeCode) => void;
}

export function ReportDialog({ open, onClose, onReportingSubmit }: PropTypes) {
  const [type, updateType] = React.useState<ReportTypeCode>(null);
  const types = useSelector(selectReportTypes);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateType(event.target.value as ReportTypeCode);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onReportingSubmit && onReportingSubmit(type);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={handleSubmit}>
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
          <Button color="primary" autoFocus type="submit">
            {Resources.getString(StringID.ACTION_REPORT)}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
