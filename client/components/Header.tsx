import { AppBar, createStyles, Link, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(3),
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
          <Link href="/" color="inherit" underline="none">
            Queueing
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;