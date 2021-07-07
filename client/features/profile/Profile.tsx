import { CircularProgress, Button } from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import { Logger } from '@nestjs/common';
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
  const [loading, updateLoading] = useState(false);
  const [loginDialogOpened, updateLoginDialogOpened] = useState(false);
  const profile = useSelector(selectProfile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    updateLoading(true);
    dispatch(getProfile())
      .then(unwrapResult)
      .catch((err) => Logger.error(err))
      .finally(() => updateLoading(false));
  }, [dispatch]);

  if (loading) {
    return <CircularProgress color="secondary" size={20} />;
  }

  if (profile) {
    return (
      <>
        <Button color="inherit" onClick={(e) => setAnchor(e.currentTarget)}>
          {profile.name}
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
