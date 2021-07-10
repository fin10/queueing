import { Dialog, DialogContent, DialogContentText } from '@material-ui/core';
import React from 'react';

interface PropTypes {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly errorMessage?: string;
}

export default function ErrorDialog({ open, onClose, errorMessage }: PropTypes) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent>
        <DialogContentText>{errorMessage}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
