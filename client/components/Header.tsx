import React, { useEffect, useState } from 'react';
import axios from 'axios';
import qs from 'query-string';
import {
  AppBar,
  Button,
  createStyles,
  Link,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import LoginDialog from './LoginDialog';
import { User } from '../types';

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isOpened, openLoginDialog] = useState(false);
  const [user, updateUser] = useState<User | null>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    axios
      .get<User>('/api/user/profile')
      .then((res) => updateUser(res.data))
      .catch(() => {
        // ignored
      });
  }, []);

  const query = qs.stringify({ redirect: window.location.pathname });

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" align="center" className={classes.title}>
          <Link href="/" color="inherit" underline="none">
            {Resources.getString(StringID.HEADER_TITLE)}
          </Link>
        </Typography>
        {user ? (
          <>
            <Button color="inherit" onClick={handleProfileMenuOpen}>
              {user.id}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem component="a" href={`/api/auth/logout?${query}`}>
                {Resources.getString(StringID.HEADER_LOGOUT)}
              </MenuItem>
            </Menu>
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
