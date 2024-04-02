'use client';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import React from 'react';
import { useColorScheme } from './ColorModeProvider';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme: mode } = useColorScheme();

  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : theme}>
      {children}
    </ThemeProvider>
  );
}
