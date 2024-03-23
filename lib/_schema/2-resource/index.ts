import { CompanyFYSchema, UserSchema } from '../1-schema';

import {
  collection,
  doc,
  Firestore,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { z } from 'zod';

export type UseCreateResource<Schema extends z.ZodType<any, any>> = {
  name: string;
  schema: Schema;
};

export type CreateResource<Schema extends z.ZodType<any, any>> =
  UseCreateResource<Schema> & { firestore: Firestore };

export function createResource<Schema extends z.ZodType<any, any>>({
  name,
  schema,
  firestore,
}: CreateResource<Schema>) {
  const converter = {
    toFirestore: (data: z.infer<Schema>) => data,
    fromFirestore: (snap: QueryDocumentSnapshot<z.infer<Schema>>) =>
      snap.data(),
  };

  const baseref = collection(firestore, name);
  const ref = collection(firestore, name).withConverter(converter);

  const getRef = (id: string) => doc<z.infer<Schema>>(baseref, id);

  return {
    name,
    schema,
    converter,
    baseref,
    ref,
    getRef,
    firestore,
  };
}

export function useCreateResource<Schema extends z.ZodType<any, any>>({
  name,
  schema,
}: UseCreateResource<Schema>) {
  const firestore = useFirestore();

  if (!firestore) {
    throw new Error('Initialize firestore properly.');
  }

  return createResource({ name, schema, firestore });
}

export const useUserResource = () =>
  useCreateResource({
    name: 'user',
    schema: UserSchema,
  });

export const useFYResource = () =>
  useCreateResource({
    name: `fy-data`,
    schema: CompanyFYSchema,
  });
