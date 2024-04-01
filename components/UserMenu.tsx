'use client';
import { useAuthAPI, useCurrentUser } from '@/db';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const UserMenu = () => {
  const user = useCurrentUser();
  const { signout } = useAuthAPI();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = async (arg: () => void | Promise<void>) => {
    await arg();
    setAnchorElUser(null);
  };

  return (
    <>
      <Tooltip title="Open Menu">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            alt={user.name}
            src={user.photoUrl || undefined}
            sx={{ width: 36, height: 36 }}
          >
            {user.name[0]}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem
          onClick={async () => {
            await handleCloseUserMenu(async () => {
              await signout();
            });
          }}
        >
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
export default UserMenu;
