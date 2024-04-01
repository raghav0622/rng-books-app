'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  RecoilState,
  SerializableParam,
  useRecoilCallback,
  useRecoilValue,
} from 'recoil';

export function useAtomFamilyStateAPI<T, P extends SerializableParam>(
  atomFamily: (param: P) => RecoilState<T>
) {
  const setAtom = useRecoilCallback(
    ({ set }) =>
      (id: P, data: T) =>
        set(atomFamily(id), data)
  );

  const getAtom = useRecoilCallback(
    ({ snapshot }) =>
      (id: P) =>
        snapshot.getLoadable(atomFamily(id)).getValue()
  );

  const resetAtom = useRecoilCallback(
    ({ reset }) =>
      (id: P) =>
        reset(atomFamily(id))
  );

  const updateAtom = useRecoilCallback(
    ({ set, snapshot }) =>
      (id: P, payload: (prev: T) => T) => {
        const prev = snapshot.getLoadable(atomFamily(id)).getValue();
        const update = payload(prev);

        set(atomFamily(id), update);
      }
  );

  return {
    setAtom,
    getAtom,
    resetAtom,
    updateAtom,
  };
}

export const useIdsStateAPI = (atom: RecoilState<string[]>) => {
  const value = useRecoilValue(atom);

  const set = useRecoilCallback(
    ({ set }) =>
      (data: ((currVal: string[]) => string[]) | string[]) => {
        set(atom, data);
      }
  );

  const reset = useRecoilCallback(
    ({ reset }) =>
      () =>
        reset(atom)
  );

  const addID = (id: string) => {
    set((ids) => {
      return [...Array.from(ids), id];
    });
  };

  const removeID = (id: string) => {
    set((ids) => {
      const payload = [...ids];
      const index = payload.indexOf(id, 0);

      payload.splice(index, 1);

      return payload;
    });
  };

  return {
    addID,
    removeID,
    value,
    set,
    reset,
  };
};

export function useAtomStateAPI<T extends Record<string, any>>(
  atom: RecoilState<T>
) {
  const value = useRecoilValue(atom);

  const setAtom = useRecoilCallback(
    ({ set }) =>
      (data: T) =>
        set(atom, data as T)
  );

  const updateAtom = useRecoilCallback(
    ({ set, snapshot }) =>
      (payload: (prev: T) => T) => {
        const prev = snapshot.getLoadable(atom).getValue();
        const update = payload(prev);

        set(atom, update);
      }
  );

  const resetAtom = useRecoilCallback(
    ({ reset }) =>
      () =>
        reset(atom)
  );

  return {
    value,
    setAtom,
    updateAtom,
    resetAtom,
  };
}
