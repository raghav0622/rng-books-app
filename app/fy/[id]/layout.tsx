'use client';

import FYLayout from '@/components/Layout/Layout';
import React from 'react';

export default function FYLayoutComponent({
  params: { id },
  children,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return <FYLayout id={id}>{children}</FYLayout>;
}
