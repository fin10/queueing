import React from 'react';
import { AppBar, createStyles, Link, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import { Profile } from '../features/profile/Profile';

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

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link href="/" color="inherit" underline="none">
            {Resources.getString(StringID.HEADER_TITLE)}
          </Link>
        </Typography>
        <Profile />
      </Toolbar>
    </AppBar>
  );
}
