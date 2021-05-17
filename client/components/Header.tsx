import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  AppBar,
  Button,
  CircularProgress,
  createStyles,
  Link,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import LoginDialog from './LoginDialog';
import ProfileMenu from './ProfileMenu';
import { getProfile, ProfileState } from '../features/profile/profileSlice';
import { useAppDispatch } from '../app/store';

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

  const profileState = useSelector<{ profile: ProfileState }, ProfileState>((state) => state.profile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (profileState.error) console.error(profileState.error.stack);

  const LoginMenu = () => {
    if (profileState.loading) {
      return <CircularProgress color="secondary" size={20} />;
    } else if (profileState.profile) {
      return (
        <>
          <Button color="inherit" onClick={(e) => setAnchor(e.currentTarget)}>
            {profileState.profile.name}
          </Button>
          <ProfileMenu anchor={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} />
        </>
      );
    } else {
      return (
        <>
          <Button color="inherit" onClick={() => openLoginDialog(true)}>
            {Resources.getString(StringID.HEADER_LOGIN)}
          </Button>
          <LoginDialog open={isOpened} onClose={() => openLoginDialog(false)} />
        </>
      );
    }
  };

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link href="/" color="inherit" underline="none">
            {Resources.getString(StringID.HEADER_TITLE)}
          </Link>
        </Typography>
        <LoginMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
