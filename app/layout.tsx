import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { theme } from './theme';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
      <head>
        <ColorSchemeScript />
      </head>

      <body
        className={
          'relative flex flex-col h-[100dvh] w-[100dvw] max-w-[100dvw] max-h-[100dvh] overflow-hidden ' +
          inter.className
        }
      >
        <MantineProvider theme={theme}>
          <>{children}</>
        </MantineProvider>
      </body>
    </html>
  );
}
