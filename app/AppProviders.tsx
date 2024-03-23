'use client';

import { Notifications } from '@mantine/notifications';
import { SlotsProvider } from '@rng-apps/forms';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import dynamic from 'next/dynamic';
import React, { PropsWithChildren } from 'react';
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  useFirebaseApp,
} from 'reactfire';
import { RecoilRoot } from 'recoil';

const firebaseConfig = {
  apiKey: 'AIzaSyC9vhYuUK4NfINyhMckjKYhieo8-yjcPDo',
  authDomain: 'rng-books-app.firebaseapp.com',
  projectId: 'rng-books-app',
  storageBucket: 'rng-books-app.appspot.com',
  messagingSenderId: '49511399500',
  appId: '1:49511399500:web:12a4b9a4dffe319318f4e9',
  measurementId: 'G-PYZJENTB63',
};

const NoSSRWrapper = dynamic(
  () =>
    Promise.resolve((props: React.PropsWithChildren) => (
      <React.Fragment>{props.children}</React.Fragment>
    )),
  {
    ssr: false,
  }
);

const FirebaseProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>
    </AuthProvider>
  );
};

export const AppFirebaseWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
      <FirebaseProviders>
        <>{children}</>
      </FirebaseProviders>
    </FirebaseAppProvider>
  );
};

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NoSSRWrapper>
      <RecoilRoot>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <Notifications position="bottom-center" />
          <SlotsProvider>
            <ProgressBar height="4px" options={{ showSpinner: false }} />
            <AppFirebaseWrapper>{children}</AppFirebaseWrapper>
          </SlotsProvider>
        </ThemeProvider>
      </RecoilRoot>
    </NoSSRWrapper>
  );
}
