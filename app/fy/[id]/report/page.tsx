'use client';

import GroupCard from '@/_components/Group/Group-Report';
import PageContent from '@/_components/Layout/PageContent';
import { useFYStateDerivatives } from '@/_schema';

export default function FYHomePage() {
  const { bsGroups, capitalGroups } = useFYStateDerivatives();

  return (
    <>
      <PageContent>
        {capitalGroups.map((group) => (
          <GroupCard groupId={group.id} key={group.id} />
        ))}
        {bsGroups.map((group) => (
          <GroupCard groupId={group.id} key={group.id} />
        ))}
      </PageContent>
    </>
  );
}
