import { Dialog, DialogContent, Button, DialogTitle, makeStyles, createStyles } from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import React from 'react';
import qs from 'query-string';

interface PropTypes {
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    center: {
      textAlign: 'center',
    },
  }),
);

const LoginDialog = (props: PropTypes): React.ReactElement => {
  const { open, onClose } = props;

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
};

export default LoginDialog;
