import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';

interface PropTypes {
  readonly open: boolean;
  readonly onClose: () => void;
}

const ReportDialog = (props: PropTypes): React.ReactElement => {
  const { open, onClose } = props;

  const [type, updateType] = React.useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateType(event.target.value);
  };

  const handleSubmit = async () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent>
        <RadioGroup name="reportType" value={type} onChange={handleChange}>
          <FormControlLabel value="rude" control={<Radio />} label={Resources.getString(StringID.REPORT_TYPE_RUDE)} />
          <FormControlLabel value="ad" control={<Radio />} label={Resources.getString(StringID.REPORT_TYPE_AD)} />
          <FormControlLabel value="lewd" control={<Radio />} label={Resources.getString(StringID.REPORT_TYPE_LEWD)} />
          <FormControlLabel
            value="illegal"
            control={<Radio />}
            label={Resources.getString(StringID.REPORT_TYPE_ILLEGAL)}
          />
          <FormControlLabel
            value="copyright"
            control={<Radio />}
            label={Resources.getString(StringID.REPORT_TYPE_COPYRIGHT)}
          />
          <FormControlLabel
            value="plastered"
            control={<Radio />}
            label={Resources.getString(StringID.REPORT_TYPE_PLASTERED)}
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {Resources.getString(StringID.ACTION_CANCEL)}
        </Button>
        <Button onClick={handleSubmit} color="primary" autoFocus>
          {Resources.getString(StringID.ACTION_REPORT)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog;
