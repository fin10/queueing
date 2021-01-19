import { Dialog, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import React from 'react';

interface PropTypes {
  open: boolean;
  onClose: () => void;
  contentText: string;
  positiveText: string;
  onPositiveClick: () => void;
}

const ConfirmDialog = (props: PropTypes): React.ReactElement => {
  const { open, onClose, contentText, positiveText, onPositiveClick } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {Resources.getString(StringID.ACTION_CANCEL)}
        </Button>
        <Button onClick={() => onPositiveClick()} color="primary" autoFocus>
          {positiveText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
