'use client';

import { createContext, ReactNode, useMemo, useState } from 'react';

type LocationContextType = {
  selected: string;
  setSelected: (value: string) => void;
};

export const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState('Moscow');

  const value = useMemo(
    () => ({
      selected,
      setSelected,
    }),
    [selected],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
