import React, { createContext, useContext, useState } from 'react';

interface HeaderHeightContextType {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
}

const HeaderHeightContext = createContext<HeaderHeightContextType | undefined>(undefined);

export function HeaderHeightProvider({ children }: { children: React.ReactNode }) {
  const [headerHeight, setHeaderHeight] = useState(64);

  return (
    <HeaderHeightContext.Provider value={{ headerHeight, setHeaderHeight }}>
      {children}
    </HeaderHeightContext.Provider>
  );
}

export function useHeaderHeight() {
  const context = useContext(HeaderHeightContext);
  if (context === undefined) {
    throw new Error('useHeaderHeight must be used within HeaderHeightProvider');
  }
  return context;
}
