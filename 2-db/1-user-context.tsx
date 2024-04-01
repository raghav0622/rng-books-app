'use client';
import { User } from '@/schema';
import { redirect } from 'next/navigation';
import React, { useContext } from 'react';

export const UserContext = React.createContext<User | undefined>(undefined);

export const useCurrentUser = () => {
  const user = useContext(UserContext);

  if (user === undefined) {
    redirect('/auth/signin');
  }

  return user;
};

export const useCurrentUserNotStrict = () => {
  const user = useContext(UserContext);

  // if (user === undefined) {
  //   redirect('/auth/signin');
  // }

  return user;
};
