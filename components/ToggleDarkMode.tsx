import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '../providers/ColorModeProvider';

const ToggleDarkMode = () => {
  const { theme, setTheme } = useColorScheme();
  return (
    <Tooltip
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <IconButton
        sx={{ ml: 1 }}
        onClick={() =>
          theme === 'dark' ? setTheme('light') : setTheme('dark')
        }
        color="inherit"
      >
        {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ToggleDarkMode;
