import React, { createContext, useContext, useRef, RefObject } from 'react';

interface ScrollContainerContextType {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

const ScrollContainerContext = createContext<ScrollContainerContextType | null>(null);

export const ScrollContainerProvider: React.FC<{
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}> = ({ scrollContainerRef, children }) => {
  return (
    <ScrollContainerContext.Provider value={{ scrollContainerRef }}>
      {children}
    </ScrollContainerContext.Provider>
  );
};

export const useScrollContainer = (): ScrollContainerContextType => {
  const context = useContext(ScrollContainerContext);
  if (!context) {
    return { scrollContainerRef: { current: null } };
  }
  return context;
};
