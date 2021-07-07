import { MenuItem, Menu } from '@material-ui/core';
import React from 'react';
import qs from 'query-string';
import { Resources } from '../../resources/Resources';
import { StringID } from '../../resources/StringID';

interface PropTypes {
  readonly anchor: HTMLElement | null;
  readonly open: boolean;
  readonly onClose: () => void;
}

export default function ProfileMenu({ anchor, open, onClose }: PropTypes) {
  const query = qs.stringify({ redirect: window.location.pathname });

  return (
    <Menu anchorEl={anchor} open={open} onClose={onClose}>
      <MenuItem component="a" href={`/api/auth/logout?${query}`}>
        {Resources.getString(StringID.HEADER_LOGOUT)}
      </MenuItem>
    </Menu>
  );
}
