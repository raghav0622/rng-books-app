import { ColorSchemeScript } from '@mantine/core';
import { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import './globals.css';
const LayoutClient = dynamic(() => import('./layout-client'), { ssr: false });

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
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
