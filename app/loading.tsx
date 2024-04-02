import AppLogo from '@/components/AppLogo';
import { LinearProgress, Stack } from '@mui/material';

function RootLoader() {
  return (
    <Stack
      style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      }}
    >
      <AppLogo />
      <LinearProgress />
    </Stack>
  );
}

export default RootLoader;
