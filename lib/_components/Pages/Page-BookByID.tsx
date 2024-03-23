import { useFYState, useGetDerived } from '@/_schema';
import {
  Badge,
  Container,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { currency } from '@rng-apps/forms';
import { redirect } from 'next/navigation';
import DrawerTransacttionCreateCarry from '../Drawers/Drawer-Transaction-Create-Carry';
import ViewTransactionTableInBook from '../Transaction/ViewTransactionTableInBook';

function PageBookById({ book_id: id }: { book_id: string }) {
  const { baseUrl } = useFYState();
  const { getBook } = useGetDerived();
  const theme = useMantineTheme();

  const book = getBook(id);
  // const { isDesktop } = useDevice();
  if (!book) redirect(baseUrl);

  return (
    <Stack mx="-sm" my="-sm" className="relative">
      <Group wrap="nowrap" p="sm" gap="xs" className="sticky top-0 shadow-md">
        <Text size="md" className="font-semibold" truncate>
          {book.id === 'cash-book' ? 'Cash Book' : book.name}
        </Text>

        <div className="ml-auto" />

        {/* <ActionsBook id={book.id} menu={!isDesktop} /> */}
      </Group>

      <Stack p="sm" mt="-xs">
        <Group gap="xs">
          <Badge
            variant="outline"
            className="flex-shrink-0"
            color={book.balance >= 0 ? theme.colors.green[9] : 'red'}
          >
            Balance:&nbsp;
            {currency(book.balance, true)}
          </Badge>
          <Badge variant="outline" className="flex-shrink-0">
            Transaction Count: {book.transactionCount}
          </Badge>
        </Group>
        {book.type === 'Account' && book.transactionCount === 0 && (
          <Container size="xs">
            <DrawerTransacttionCreateCarry bookId={book.id} />
          </Container>
        )}
        {book.transactionCount !== 0 && (
          <ViewTransactionTableInBook id={book.id} />
        )}
      </Stack>
    </Stack>
  );
}

export default PageBookById;
