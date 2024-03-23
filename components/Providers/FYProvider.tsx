import { useCompanyDB, useFYResource } from '@/db';
import { CompanyFY } from '@/schema';
import {
  useFYDBState,
  useFYState,
  usePopulateAndDepopulateState,
} from '@/state';
import { redirect, useRouter } from 'next/navigation';
import React, { PropsWithChildren, useEffect } from 'react';
import { useFirestoreDocData } from 'reactfire';

function separateIds(fullId: string): [string, string] {
  const parts: string[] = fullId.split('-');
  const fyIdStart = parts.length - 3;
  const parentId: string = [...parts].splice(0, fyIdStart).join('-');
  return [parentId, fullId];
}

const FYProvider: React.FC<PropsWithChildren<{ id: string }>> = ({
  children,
  id,
}) => {
  const [companyId, fyId] = separateIds(id);

  const { getCompany } = useCompanyDB();
  const { getRef: getFyRef } = useFYResource();

  const company = getCompany(companyId);

  const fy = useFirestoreDocData<CompanyFY>(getFyRef(fyId)).data;
  const router = useRouter();

  const { populate, dePopulate } = usePopulateAndDepopulateState();
  const { setFYDB } = useFYDBState();
  const { fy: fyState } = useFYState();
  useEffect(() => {
    if (company && fy) {
      populate(company, fy);
    } else {
      router.push('/');
    }

    return () => dePopulate();
  }, []);

  useEffect(() => {
    if (fy) {
      setFYDB(fy);

      if (fy.version !== fyState.version && company) {
        dePopulate();
        populate(company, fy);
      }
    }
  }, [fy]);

  if (!company || !fy) {
    return redirect('/');
  }

  return children;
};

export default FYProvider;
