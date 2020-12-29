import { AppBar, createStyles, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

const Header = (): React.ReactElement => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" align="center" className={classes.title}>
          Queueing
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
