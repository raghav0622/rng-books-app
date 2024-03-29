'use client';

import { useCompanyDB } from '@/db';
import { Alert } from '@mantine/core';
import { lazy } from 'react';

const CompanyItem = lazy(() => import('./Company-Card'));

function CompaniesList() {
  const { companies } = useCompanyDB();

  if (companies.length === 0) {
    return <Alert>No Companies to show.</Alert>;
  }

  return (
    <>
      {companies.map((c) => (
        <CompanyItem company={c} key={c.id} />
      ))}
    </>
  );
}

export default CompaniesList;
