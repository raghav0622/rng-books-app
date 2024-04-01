'use client';
// import { SlotsProvider } from '@rng-apps/forms';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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

const FirebaseSubWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>
    </AuthProvider>
  );
};

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
      <FirebaseSubWrapper>
        <RecoilRoot>{children}</RecoilRoot>
      </FirebaseSubWrapper>
    </FirebaseAppProvider>
  );
}
