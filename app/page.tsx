'use client';
import AppLogo from '@/components/AppLogo';
import UserMenu from '@/components/UserMenu';
import { useCurrentUser } from '@/db';
import { AppBar, Container, Toolbar } from '@mui/material';

export default function Page() {
  const user = useCurrentUser();
  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        sx={{ boxShadow: 0, borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar variant="dense">
          <AppLogo />
          <div className="flex-grow" />
          <UserMenu />
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">{user.email}</Container>
    </>
  );
}
