'use client';

import { Book, Group, GroupDerived } from '@/schema';
import { useFYState, useGetDerived } from '@/state';
import {
  Button,
  Card,
  Grid,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { cn, currency, useDevice } from '@rng-apps/forms';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';
import EditCapitalTransactionBtn from '../Transaction/EditCapitialTransaction';

const Entry: React.FC<{
  href?: string;
  onClick?: () => void | Promise<void>;
  title?: string;
  balance?: number;
  tooltip?: string;
  empty?: boolean;
  italic?: boolean;
  total?: boolean;
  disabled?: boolean;
}> = ({
  href,
  title = ' ',
  tooltip,
  balance,
  onClick,
  empty = false,
  italic = false,
  total = false,
  disabled = false,
}) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const color = total
    ? theme.colors.blue[colorScheme === 'dark' ? 3 : 9]
    : balance !== undefined
    ? balance >= 0
      ? theme.colors.green[colorScheme === 'dark' ? 3 : 9]
      : 'red'
    : '';
  const variant = empty ? 'transparent' : 'outline';

  const withTooltip = (content: React.ReactNode) => (
    <Tooltip label={tooltip}>{content}</Tooltip>
  );

  const content = (
    <Button
      color={color}
      variant={variant}
      px="sm"
      size="sm"
      styles={{
        label: {
          display: 'flex',
          width: '100%',
          flexWrap: 'nowrap',
          fontStyle: !empty && italic ? 'italic' : 'unset',
          cursor: empty ? 'default' : 'unset',
        },
      }}
      tabIndex={empty ? -1 : undefined}
      onClick={async () => {
        if (onClick) await onClick();
        if (href) router.push(href);
      }}
    >
      <Text truncate className="flex-grow text-left">
        {title}
      </Text>
      {balance !== undefined && (
        <span
          className={cn(balance >= 0 ? 'text-success' : 'text-destructive')}
        >
          {currency(Math.abs(balance))}
        </span>
      )}
    </Button>
  );

  return tooltip !== undefined ? withTooltip(content) : content;
};

const BookEntry: React.FC<{ book: Book }> = ({ book }) => {
  const { baseUrl } = useFYState();

  if (book.id === 'capital-from-previous-year') {
    return (
      <EditCapitalTransactionBtn
        customChild={(open) => (
          <Entry
            balance={book.balance}
            onClick={() => open()}
            tooltip={`Edit Capital Back Foward`}
            title={book.name}
          />
        )}
      />
    );
  } else
    return (
      <Entry
        balance={book.balance}
        href={baseUrl + `/book/${book.id}`}
        tooltip={`Go To: ${book.name}`}
        title={book.name}
      />
    );
};

const GroupEntry: React.FC<{ group: Group }> = ({ group: _group }) => {
  const { getGroup: getGroupData } = useGetDerived();
  const group = getGroupData(_group.id);

  if (!group) return null;

  return (
    <Entry
      balance={group.id === 'capital' ? Math.abs(group.balance) : group.balance}
      href={`#group-report-${group.id}`}
      tooltip={`Go To: ${group.name}`}
      title={group.name}
    />
  );
};

const BookOrGroupEntry: React.FC<{
  data: Book | Group;
}> = ({ data }) => {
  if (data.recordType === 'Book') return <BookEntry book={data} />;
  if (data.recordType === 'Group') return <GroupEntry group={data} />;
  return null;
};

const GroupSummary: React.FC<{
  id: string;
  type: 'CR' | 'DR';
  difference: number;
  total: number;
  entries: Array<Group | Book>;
  balanceLabel: string;
  totalEntries: number;
}> = ({ id, difference, total, entries, type, balanceLabel, totalEntries }) => {
  const { isDesktop } = useDevice();
  const totalPrint =
    type === 'CR'
      ? difference > 0
        ? Math.abs(total)
        : Math.abs(total) + Math.abs(difference)
      : difference > 0
      ? Math.abs(total) + Math.abs(difference)
      : Math.abs(total);

  const emptyEntryCount = totalEntries - entries.length;
  const emptyItems = Array.from({ length: emptyEntryCount }, (_, index) => (
    <Entry empty key={id + 'empty' + index} />
  ));

  return (
    <Stack gap="sm" className="flex-auto">
      <Text size="sm" className="text-center">
        {type === 'DR' ? (
          id === 'balance-sheet' ? (
            <>Liabilities</>
          ) : (
            <>Particulars (DR)</>
          )
        ) : id === 'balance-sheet' ? (
          <>Assets</>
        ) : (
          <>Particulars (CR)</>
        )}
      </Text>

      {entries.length > 0 &&
        entries.map((entry) => {
          if (!entry) return null;

          return <BookOrGroupEntry data={entry} key={entry.id} />;
        })}

      {isDesktop && emptyItems}

      {difference !== 0 && (
        <>
          {isDesktop && (
            <>
              {type === 'DR' && difference < 0 ? <Entry empty /> : null}
              {type === 'CR' && difference > 0 ? <Entry empty /> : null}
            </>
          )}

          {type === 'CR' && difference < 0 ? (
            <Entry title={balanceLabel} balance={difference} italic disabled />
          ) : null}
          {type === 'DR' && difference > 0 ? (
            <Entry title={balanceLabel} balance={difference} italic disabled />
          ) : null}
        </>
      )}

      <Entry total title={'Total'} balance={totalPrint} italic disabled />
    </Stack>
  );
};

const GroupData: React.FC<{
  group: GroupDerived;
}> = ({ group }) => {
  const { isLandscape } = useDevice();
  const { getGroup: getGroupData } = useGetDerived();

  const expandedGroupBooks = group.childGroups
    .filter((g) => g.exploded)
    .map((group) => getGroupData(group.id))
    .map((group) => (group ? group.childBooks : []))
    .flat();

  const capitalCarryBook = group.childBooks.find(
    (b) => b.id === 'capital-from-previous-year'
  );

  const booksCr = group.childBooks.filter(
    (b) => b.balance >= 0 && b.id !== 'capital-from-previous-year'
  );
  const booksDr = group.childBooks.filter((b) => b.balance < 0);

  const groupsCr = group.childGroups.filter(
    (g) => g.childCount !== 0 && g.balance >= 0 && !g.exploded
  );
  const groupsDr = group.childGroups.filter(
    (g) => g.childCount !== 0 && g.balance < 0 && !g.exploded
  );

  const expandedGroupBooksCr = expandedGroupBooks.filter((b) =>
    b ? b.balance >= 0 : false
  );
  const expandedGroupBooksDr = expandedGroupBooks.filter((b) =>
    b ? b.balance < 0 : false
  );

  const crEntries =
    capitalCarryBook && capitalCarryBook.balance >= 0
      ? [capitalCarryBook, ...groupsCr, ...expandedGroupBooksCr, ...booksCr]
      : [...groupsCr, ...expandedGroupBooksCr, ...booksCr];
  const drEntries =
    capitalCarryBook && capitalCarryBook.balance < 0
      ? [capitalCarryBook, ...groupsDr, ...expandedGroupBooksDr, ...booksDr]
      : [...groupsDr, ...expandedGroupBooksDr, ...booksDr];

  const crBalance = crEntries.reduce((sum, book) => sum + book.balance, 0);

  const drBalance = drEntries.reduce((sum, book) => sum + book.balance, 0);

  const difference = crBalance + drBalance;

  const totalEntries =
    crEntries.length > drEntries.length ? crEntries.length : drEntries.length;

  return (
    <Grid>
      <Grid.Col span={{ xs: isLandscape ? 6 : 12, md: 6 }}>
        <GroupSummary
          totalEntries={totalEntries}
          id={group.id}
          total={drBalance}
          difference={difference}
          balanceLabel={group.balanceDRLabel}
          entries={drEntries}
          type="DR"
        />
      </Grid.Col>
      <Grid.Col span={{ xs: isLandscape ? 6 : 12, md: 6 }}>
        <GroupSummary
          totalEntries={totalEntries}
          id={group.id}
          total={crBalance}
          difference={difference}
          balanceLabel={group.balanceCRLabel}
          entries={crEntries}
          type="CR"
        />
      </Grid.Col>
    </Grid>
  );
};

const GroupCard: React.FC<{
  groupId: string;
}> = ({ groupId }) => {
  const group = useGetDerived().getGroup(groupId);

  if (!group) return null;

  if (group.childBooks.length === 0 && group.childGroups.length === 0)
    return null;

  if (group.exploded) {
    return null;
  } else {
    return (
      <Card withBorder id={'group-report-' + group.id}>
        <Stack gap="sm">
          <Title className="text-center" order={5}>
            {group.name}
          </Title>
          <GroupData group={group} />
        </Stack>
      </Card>
    );
  }
};

export default GroupCard;
