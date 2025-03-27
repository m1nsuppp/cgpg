import { BackgroundRemover } from '@/lib/background-remover';
import { createContext, useContext } from 'react';

export const BackgroundRemoverContext = createContext<BackgroundRemover | undefined>(undefined);
BackgroundRemoverContext.displayName = 'BackgroundRemoverContext';

export function useBackgroundRemover(): BackgroundRemover {
  const context = useContext(BackgroundRemoverContext);
  if (context === undefined) {
    throw new Error('useBackgroundRemover must be used within a BackgroundRemoverProvider');
  }

  return context;
}
