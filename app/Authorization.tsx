'use client';

import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSigninCheck } from 'reactfire';
import AppLayout from './AppLayout';
import AppLoader from './loading';

import UserDataProvider from '@/components/Providers/UserProvider';

const Authorization: React.FC<React.PropsWithChildren> = ({ children }) => {
  const {
    data: { signedIn, user },
  } = useSigninCheck({
    suspense: true,
  });

  const pathname = usePathname();
  const router = useRouter();
  const isAuthPath = pathname.startsWith('/auth');

  useEffect(() => {
    if (isAuthPath && signedIn) {
      router.push('/');
    }
    if (!isAuthPath && !signedIn) {
      router.push('/auth/signin');
    }
  }, [isAuthPath, signedIn, router]);

  if (isAuthPath) {
    if (signedIn && user) return <AppLoader />;
    if (!signedIn || !user) return <>{children}</>;
  }

  if (user && !isAuthPath) {
    return (
      <UserDataProvider id={user.uid}>
        <AppLayout>{children}</AppLayout>
      </UserDataProvider>
    );
  } else return <AppLoader />;
};

export default Authorization;
