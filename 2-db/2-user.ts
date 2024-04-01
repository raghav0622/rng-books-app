'use client';
import { User } from '@/schema';
import { setDoc, updateDoc } from 'firebase/firestore';
import { useUserResource } from './0-resource';
import { useCurrentUser } from './1-user-context';

export const useUserDB = () => {
  const { getRef } = useUserResource();

  const createUser = async (payload: User) => {
    const ref = getRef(payload.id);

    await setDoc(ref, payload);

    return payload;
  };

  const updateUser = async (user: string, payload: Partial<User>) => {
    const ref = getRef(user);

    await updateDoc(ref, { ...payload });
  };

  return { createUser, updateUser };
};

export const useUserAutoCompleteDataDB = (key: string) => {
  const { updateUser } = useUserDB();
  const user = useCurrentUser();

  const options =
    user.autoCompleteKeys.find((option) => option.key === key)?.value || [];

  const addOption = async (newVal: string) => {
    const existingKeys = user.autoCompleteKeys;
    const index = existingKeys.findIndex((k) => k.key === key);
    if (index !== -1) {
      const payload = { key, value: [...existingKeys[index].value, newVal] };

      const updatedKeys = [...existingKeys];
      updatedKeys.splice(index, 1, payload);

      await updateUser(user.id, {
        autoCompleteKeys: updatedKeys,
      });
    } else {
      const payload = { key, value: [newVal] };

      await updateUser(user.id, {
        autoCompleteKeys: [...existingKeys, payload],
      });
    }
  };

  return { options, addOption };
};
