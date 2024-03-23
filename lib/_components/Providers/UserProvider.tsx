import { User, UserContext, useUserResource } from '@/_schema';
import React from 'react';
import { useFirestoreDocData } from 'reactfire';

const useGetCurrentUserFromDB = (id: string) => {
  const { getRef } = useUserResource();
  const data = useFirestoreDocData(getRef(id), { suspense: true }).data as User;
  return data;
};

const UserDataProvider: React.FC<React.PropsWithChildren<{ id: string }>> = ({
  id,
  children,
}) => {
  const data = useGetCurrentUserFromDB(id);

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};
export default UserDataProvider;
