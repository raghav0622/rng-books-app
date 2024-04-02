'use client';

import { string } from '@/utils';
import { z } from 'zod';
import { BookSchema } from './schema-02-book';
import { GroupSchema } from './schema-03-group';

export const GroupDerivedSchema = GroupSchema.extend({
  parentGroup: GroupSchema,
  childBooks: z.array(BookSchema),
  childGroups: z.array(GroupSchema),
}).or(
  GroupSchema.extend({
    id: z.literal('balance-sheet'),
    parentGroup: string,
    childBooks: z.array(BookSchema),
    childGroups: z.array(GroupSchema),
  })
);

export type GroupDerived = z.infer<typeof GroupDerivedSchema>;
