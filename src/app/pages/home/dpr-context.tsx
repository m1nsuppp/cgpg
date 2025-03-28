import { createContext, useContext } from 'react';

export const DPRContext = createContext<number | undefined>(undefined);
DPRContext.displayName = 'DPRContext';

export function useDPR(): number {
  const context = useContext(DPRContext);
  if (context === undefined) {
    throw new Error();
  }

  return context;
}
