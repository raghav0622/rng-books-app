'use client';

import {
  boolean,
  number,
  numberPositive,
  optionalString,
  string,
} from '@/rng-forms';
import z from 'zod';
import {
  BookOrGroupCategorySchema,
  BookOrGroupTypeSchema,
} from './schema-02-book';

export const GroupSchema = z.object({
  recordType: z.literal('Group'),
  type: BookOrGroupTypeSchema,
  category: BookOrGroupCategorySchema,

  id: string,

  name: string,
  description: optionalString,
  groupLevel: numberPositive,
  editable: boolean,
  balance: number,
  balanceCRLabel: string,
  balanceDRLabel: string,
  childCount: number,
  childGroupsPossible: boolean,

  parentGroup: string,
  parentGroupName: string,

  exploded: boolean,
});

export type Group = z.infer<typeof GroupSchema>;
