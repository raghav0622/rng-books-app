'use client';

import GroupDisplay from '@/components/Group/Group-Display';
import PageContent from '@/components/Layout/PageContent';
import TransactionHistory from '@/components/Transaction/TransactionHistory';
import { useFYDerivedState } from '@/state';
import { Group, Paper, ScrollArea, Stack, Tabs } from '@mantine/core';
import { useDevice } from '@rng-apps/forms';
import { useRouter } from 'next-nprogress-bar';
import { useSearchParams } from 'next/navigation';

export default function FYHomePage() {
  const { bsGroups, capitalGroups, baseUrl } = useFYDerivedState();
  const { isDesktop } = useDevice();
  const tab = useSearchParams().get('view');
  const router = useRouter();
  return isDesktop ? (
    <>
      <PageContent scrollbarSize={2} className="flex-auto basis-0 h-full">
        {bsGroups.map((g) => (
          <GroupDisplay groupId={g.id} key={'bs' + g.id} />
        ))}
        <div />
      </PageContent>
      <PageContent scrollbarSize={2} className="flex-auto basis-0 h-full">
        {capitalGroups.map((g) => (
          <GroupDisplay groupId={g.id} key={'cap' + g.id} />
        ))}
        <div />
      </PageContent>
      <PageContent
        scrollbarSize={2}
        className="flex-auto basis-0 h-full"
        stackProps={{ py: 0 }}
      >
        <TransactionHistory />
        <div />
      </PageContent>
    </>
  ) : (
    <>
      <PageContent stackProps={{ py: 0, className: 'relative' }}>
        <Tabs
          defaultValue="accounts"
          variant="pills"
          className="flex-grow relative"
          onChange={(v) => router.push(baseUrl + '?view=' + v)}
          value={tab || 'accounts'}
        >
          <Paper className="sticky top-0 left-0 z-50">
            <ScrollArea scrollbars="x" scrollbarSize={2}>
              <Group gap="xs" py="xs" wrap="nowrap">
                <Tabs.List>
                  <Tabs.Tab size={2} value="accounts">
                    Balance Sheet
                  </Tabs.Tab>
                  <Tabs.Tab size="xs" value="ledgers">
                    Capital A/c
                  </Tabs.Tab>
                  <Tabs.Tab size="xs" value="transactions">
                    Transactions
                  </Tabs.Tab>
                </Tabs.List>
              </Group>
            </ScrollArea>
          </Paper>
          <Tabs.Panel value="accounts">
            <Stack gap="xs">
              {bsGroups.map((g) => (
                <GroupDisplay groupId={g.id} key={'bs' + g.id} />
              ))}
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="ledgers">
            <Stack gap="xs">
              {capitalGroups.map((g) => (
                <GroupDisplay groupId={g.id} key={'capital' + g.id} />
              ))}
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="transactions" className="relative">
            <Stack gap="xs" className="relative">
              <TransactionHistory />
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </PageContent>
    </>
  );
}
