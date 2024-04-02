import AppThemeProvider from '@/providers/ThemeProvider';
import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Metadata, Viewport } from 'next';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import dynamic from 'next/dynamic';
import Authorization from './auth-wrapper';
import './globals.css';

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={
          'relative flex flex-col h-[100dvh] w-[100dvw] max-w-[100dvw] max-h-[100dvh]'
        }
      >
        <NextThemeProvider>
          <AppThemeProvider>
            <RootProvider>
              <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <CssBaseline />
                <Authorization>{children}</Authorization>
              </AppRouterCacheProvider>
            </RootProvider>
          </AppThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  );
}
