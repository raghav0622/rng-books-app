'use client';

import PageContent from '@/components/Layout/PageContent';
import BookPageByID from '@/components/Pages/Page-BookByID';

export default function BookByIDPage({
  params: { book_id: id },
}: {
  params: { book_id: string };
}) {
  return (
    <PageContent>
      <BookPageByID book_id={id} />
    </PageContent>
  );
}
