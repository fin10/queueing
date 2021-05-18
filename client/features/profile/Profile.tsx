import { CircularProgress, Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { Resources } from '../../resources/Resources';
import { StringID } from '../../resources/StringID';
import { selectProfile, getProfile } from './profileSlice';
import LoginDialog from './LoginDialog';
import ProfileMenu from './ProfileMenu';

export function Profile() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [loginDialogOpened, updateLoginDialogOpened] = useState(false);
  const profileState = useSelector(selectProfile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (profileState.error) console.error(profileState.error.stack);

  if (profileState.loading) {
    return <CircularProgress color="secondary" size={20} />;
  }

  if (profileState.profile) {
    return (
      <>
        <Button color="inherit" onClick={(e) => setAnchor(e.currentTarget)}>
          {profileState.profile.name}
        </Button>
        <ProfileMenu anchor={anchor} open={!!anchor} onClose={() => setAnchor(null)} />
      </>
    );
  }

  return (
    <>
      <Button color="inherit" onClick={() => updateLoginDialogOpened(true)}>
        {Resources.getString(StringID.HEADER_LOGIN)}
      </Button>
      <LoginDialog open={loginDialogOpened} onClose={() => updateLoginDialogOpened(false)} />
    </>
  );
}
