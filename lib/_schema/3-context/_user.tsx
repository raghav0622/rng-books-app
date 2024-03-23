import { redirect } from 'next/navigation';
import React, { useContext } from 'react';
import { User } from '../1-schema';

export const UserContext = React.createContext<User | undefined>(undefined);

export const useCurrentUser = () => {
  const user = useContext(UserContext);

  if (user === undefined) {
    redirect('/auth/signin');
  }

  return user;
};
