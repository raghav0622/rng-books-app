'use client';

import PageContent from '@/_components/Layout/PageContent';
import BookPageByID from '@/_components/Pages/Page-BookByID';
import { useFYState } from '@/_schema';
import { redirect } from 'next/navigation';

export default function BookByIDPage({
  params: { book_id: id },
}: {
  params: { book_id: string };
}) {
  const { baseUrl } = useFYState();
  if (id === 'capital-from-previous-year') redirect(baseUrl);

  return (
    <PageContent>
      <BookPageByID book_id={id} />
    </PageContent>
  );
}
