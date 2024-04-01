'use client';

import { UserContext, useUserResource } from '@/db';
import { User } from '@/schema';
import React from 'react';
import { useFirestoreDocData } from 'reactfire';

const UserProvider: React.FC<React.PropsWithChildren<{ id: string }>> = ({
  id,
  children,
}) => {
  const { getRef } = useUserResource();
  const user = useFirestoreDocData(getRef(id), { suspense: true }).data as User;

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserProvider;
