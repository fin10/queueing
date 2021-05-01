import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Badge,
  Button,
  createStyles,
  IconButton,
  Link,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import LoginDialog from './LoginDialog';
import { NotificationState, ProfileState } from '../types';
import ProfileMenu from './ProfileMenu';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../redux/profile';
import { getNotifications } from '../redux/notification';

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
  const notificationState = useSelector<{ notification: NotificationState }, NotificationState>(
    (state) => state.notification,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getNotifications());
  }, [dispatch]);

  if (profileState.error) console.error(profileState.error.stack);
  if (notificationState.error) console.error(notificationState.error.stack);

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link href="/" color="inherit" underline="none">
            {Resources.getString(StringID.HEADER_TITLE)}
          </Link>
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={notificationState.notifications.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        {profileState.profile ? (
          <>
            <Button color="inherit" onClick={(e) => setAnchor(e.currentTarget)}>
              {profileState.profile.name}
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
