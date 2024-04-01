'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

interface SlotContents {
  [key: string]: React.ReactNode;
}

interface SlotsContextValue {
  slots: SlotContents;
  register: (name: string, content: React.ReactNode) => void;
  deregister: (name: string) => void;
}

const SlotsContext = createContext<SlotsContextValue>({
  slots: {},
  register: (name, content) => {},
  deregister: (name) => {},
});

export const SlotsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [slots, setSlots] = useState<SlotContents>({});

  const register = (name: string, content: React.ReactNode) => {
    setSlots((prevSlots) => ({ ...prevSlots, [name]: content }));
  };

  const deregister = (name: string) => {
    setSlots((prevSlots) => {
      const updatedSlots = { ...prevSlots };
      delete updatedSlots[name];
      return updatedSlots;
    });
  };

  return (
    <SlotsContext.Provider value={{ slots, register, deregister }}>
      {children}
    </SlotsContext.Provider>
  );
};

export const SlotContent: React.FC<{
  name: string;
  children: React.ReactNode;
  media?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}> = ({ name, children, media = 'xs' }) => {
  const isXs = useMediaQuery('(min-width: 0px)');
  const isSm = useMediaQuery('(min-width: 600px)');
  const isMd = useMediaQuery('(min-width: 900px)');
  const isLg = useMediaQuery('(min-width: 1200px)');
  const isXl = useMediaQuery('(min-width: 1536px)');

  const { register, deregister } = useContext(SlotsContext);

  useEffect(() => {
    if (media === 'xs' && isXs) register(name, children);
    if (media === 'sm' && isSm) register(name, children);
    if (media === 'md' && isMd) register(name, children);
    if (media === 'lg' && isLg) register(name, children);
    if (media === 'xl' && isXl) register(name, children);

    return () => {
      if (media === 'xs' && isXs) deregister(name);
      if (media === 'sm' && isSm) deregister(name);
      if (media === 'md' && isMd) deregister(name);
      if (media === 'lg' && isLg) deregister(name);
      if (media === 'xl' && isXl) deregister(name);
    };
  }, [name, children, media, isXs, isMd, isSm, isLg, isXl]);

  return null;
};

export const SlotView: React.FC<{
  name: string;
  nullContent?: React.ReactNode;
}> = ({ name, nullContent = null }) => {
  const { slots } = useContext(SlotsContext);
  if (slots[name]) return slots[name];

  return nullContent;
};
