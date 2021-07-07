import { Dialog, DialogContent, Button, DialogTitle, makeStyles, createStyles } from '@material-ui/core';
import React from 'react';
import qs from 'query-string';
import { Resources } from '../../resources/Resources';
import { StringID } from '../../resources/StringID';

interface PropTypes {
  readonly open: boolean;
  readonly onClose: () => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    center: {
      textAlign: 'center',
    },
  }),
);

export default function LoginDialog({ open, onClose }: PropTypes) {
  const classes = useStyles();

  const query = qs.stringify({ redirect: window.location.pathname });

  return (
    <Dialog className={classes.center} open={open} onClose={onClose}>
      <DialogTitle>{Resources.getString(StringID.HEADER_TITLE)}</DialogTitle>
      <DialogContent>
        <Button variant="outlined" href={`/api/auth/google?${query}`}>
          {Resources.getString(StringID.SIGN_IN_WITH_GOOGLE)}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
