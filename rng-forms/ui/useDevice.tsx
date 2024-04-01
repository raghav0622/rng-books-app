'use client';

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export const useDevice = () => {
  const isXs = useMediaQuery('(min-width: 30em)');
  const isSm = useMediaQuery('(min-width: 48em)');
  const isMd = useMediaQuery('(min-width: 64em)');
  const isLg = useMediaQuery('(min-width: 74em)');
  const isXl = useMediaQuery('(min-width: 90em)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  const isDesktop = isLandscape || isLg;

  const [isExternalKeyboardActive, setIsExternalKeyboardActive] =
    useState(false);

  useEffect(() => {
    const handleKeyboardChange = () => {
      //@ts-expect-error sdsadf
      setIsExternalKeyboardActive(!!navigator.keyboard);
    };

    handleKeyboardChange(); // Initial check

    // Add event listener for changes in keyboard presence
    window.addEventListener('keyboardchange', handleKeyboardChange);

    return () => {
      // Remove event listener when the component unmounts
      window.removeEventListener('keyboardchange', handleKeyboardChange);
    };
  }, []);

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isLandscape,
    isDesktop,
    isExternalKeyboardActive,
  };
};
