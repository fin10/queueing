import { AppBar, Button, createStyles, Link, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import React, { useState } from 'react';
import LoginDialog from './LoginDialog';

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

  const [isOpened, openLoginDialog] = useState(false);

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" align="center" className={classes.title}>
          <Link href="/" color="inherit" underline="none">
            {Resources.getString(StringID.HEADER_TITLE)}
          </Link>
        </Typography>
        <Button color="inherit" onClick={() => openLoginDialog(true)}>
          {Resources.getString(StringID.HEADER_LOGIN)}
        </Button>
      </Toolbar>

      <LoginDialog open={isOpened} onClose={() => openLoginDialog(false)} />
    </AppBar>
  );
};

export default Header;
