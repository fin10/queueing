import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppBar, Button, createStyles, Link, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import LoginDialog from './LoginDialog';
import { Profile } from '../types';
import ProfileMenu from './ProfileMenu';

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

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [isOpened, openLoginDialog] = useState(false);
  const [profile, updateProfile] = useState<Profile | null>(null);

  useEffect(() => {
    axios
      .get<Profile>('/api/profile')
      .then((res) => updateProfile(res.data))
      .catch(() => {
        // ignored
      });
  }, []);

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link href="/" color="inherit" underline="none">
            {Resources.getString(StringID.HEADER_TITLE)}
          </Link>
        </Typography>
        {profile ? (
          <>
            <Button color="inherit" onClick={(e) => setAnchor(e.currentTarget)}>
              {profile.name}
            </Button>
            <ProfileMenu anchor={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} />
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => openLoginDialog(true)}>
              {Resources.getString(StringID.HEADER_LOGIN)}
            </Button>
            <LoginDialog open={isOpened} onClose={() => openLoginDialog(false)} />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
