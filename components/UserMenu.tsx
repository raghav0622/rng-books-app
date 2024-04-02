'use client';
import { useAuthAPI, useCurrentUser } from '@/db';
import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

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
            sx={(t) => ({
              width: 36,
              height: 36,
              bgcolor: t.palette.primary.main,
            })}
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
        onClose={() => setAnchorElUser(null)}
      >
        <MenuItem onClick={() => setAnchorElUser(null)}>
          <ListItem sx={{ p: 0 }}>
            <ListItemAvatar sx={{ mr: -1 }}>
              <Avatar
                alt={user.name}
                src={user.photoUrl || undefined}
                sx={(t) => ({
                  width: 36,
                  height: 36,
                  bgcolor: t.palette.primary.main,
                })}
              >
                {user.name[0]}
              </Avatar>
            </ListItemAvatar>

            <ListItemText primary={user.name} secondary={user.email} />
          </ListItem>
        </MenuItem>
        <Divider />
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
