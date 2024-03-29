'use client';

import PageContent from '@/layout/PageContent';
import BookPageByID from '@/screens/Book-View-Screen';

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
