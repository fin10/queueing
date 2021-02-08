import { MenuItem, Menu } from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import React from 'react';
import qs from 'query-string';

interface PropTypes {
  anchor: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const ProfileMenu = (props: PropTypes): React.ReactElement => {
  const { anchor, open, onClose } = props;

  const query = qs.stringify({ redirect: window.location.pathname });

  return (
    <Menu anchorEl={anchor} open={open} onClose={onClose}>
      <MenuItem component="a" href={`/api/auth/logout?${query}`}>
        {Resources.getString(StringID.HEADER_LOGOUT)}
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
