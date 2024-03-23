'use client';

import GroupCard from '@/components/Group/Group-Report';
import PageContent from '@/components/Layout/PageContent';
import { useFYStateDerivatives } from '@/state';

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
