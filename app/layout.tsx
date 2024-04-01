import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import Authorization from './auth-wrapper';
import './globals.css';
import { theme } from './theme';

const RootProvider = dynamic(() => import('@/providers/RootProvider'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'RNG Books',
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          'relative flex flex-col h-[100dvh] w-[100dvw] max-w-[100dvw] max-h-[100dvh] gap-2'
        }
      >
        <RootProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Authorization>{children}</Authorization>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </RootProvider>
      </body>
    </html>
  );
}
