import { Book, Group } from '@/schema';
import {
  Anchor,
  Card,
  Group as MGroup,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { currency, fireDateString } from '@rng-apps/forms';
import React from 'react';
import ActionsBook from '../Actions/Actions-Book';

// <NavLink
//   component="div"
//   label={
//     <MGroup gap="xs" wrap="nowrap">
//       {/* {data.id === 'capital-from-previous-year' ? (
//       <EditCapitalTransactionBtn
//         customChild={(open) => (
//           <Anchor size="compact-sm" variant="transparent" onClick={open}>
//             {data.name}
//           </Anchor>
//         )}
//       />
//     ) : ( */}
//       <Anchor
//         truncate
//         size="compact-sm"
//         variant="transparent"
//         // onClick={() => {
//         //   if (data.recordType === 'Group') {
//         //     if (tabsOnHomePage) {
//         //       if (data.type === 'Account')
//         //         router.push(`${baseUrl}?view=accounts#${data.id}`);
//         //       if (data.type === 'Ledger')
//         //         router.push(`${baseUrl}?view=ledgers#${data.id}`);
//         //     } else {
//         //       if (data.type === 'Account')
//         //         router.push(`${baseUrl}/#${data.id}`);
//         //       if (data.type === 'Ledger')
//         //         router.push(`${baseUrl}/#${data.id}`);
//         //     }
//         //   }
//         //   if (data.recordType === 'Book') {
//         //     router.push(`${baseUrl}/book/${data.id}`);
//         //   }
//         // }}
//       >
//         {data.name}
//       </Anchor>
//       {/* )} */}
//       {editMenu && data.recordType === 'Book' && (
//         <ActionsBook menu id={data.id} />
//       )}
//     </MGroup>
//   }
//   rightSection={
//
//   }
// />;

const GroupDisplayEntry: React.FC<{
  data: Book | Group;
}> = ({ data }) => {
  const theme = useMantineTheme();
  return (
    <Card withBorder p="xs" className="flex flex-col">
      <div className="flex gap-1 items-center">
        <Tooltip label={'Go to ' + data.name}>
          <Anchor truncate className="mr-1">
            {data.name}
          </Anchor>
        </Tooltip>
        {data.recordType === 'Book' && <ActionsBook book={data} />}
        <Text
          size="sm"
          c={data.balance >= 0 ? theme.colors.green[9] : 'red'}
          className="flex-shrink-0 ml-auto"
        >
          {currency(data.balance, true)}
        </Text>
      </div>
      {data.recordType === 'Book' &&
        data.id !== 'capital-from-previous-year' && (
          <MGroup justify="space-between">
            <Text size="xs">
              {data.transactionCount > 0 && data.lastTransactionDate
                ? 'As on ' + fireDateString(data.lastTransactionDate)
                : 'No Transactions'}
            </Text>
          </MGroup>
        )}
    </Card>
  );
};
export default GroupDisplayEntry;
