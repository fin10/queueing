import { Dialog, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import React from 'react';

interface PropTypes {
  readonly id?: string;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly contentText: string;
  readonly positiveText: string;
  readonly onPositiveClick?: (elm: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function ConfirmDialog({ id, open, onClose, contentText, positiveText, onPositiveClick }: PropTypes) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {Resources.getString(StringID.ACTION_CANCEL)}
        </Button>
        <Button id={id} onClick={onPositiveClick} color="primary" autoFocus>
          {positiveText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
