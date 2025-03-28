import { useState, type JSX } from 'react';
import { type BackgroundRemover, createImglyBackgroundRemover } from '../lib/background-remover';
import { BackgroundRemoverContext } from './pages/home/background-remover-context';
import { Home } from './pages/home';
import { QueryClientProvider } from './query-client-provider';

export function App(): JSX.Element {
  const [backgroundRemover] = useState<BackgroundRemover>(() => createImglyBackgroundRemover());

  return (
    <BackgroundRemoverContext.Provider value={backgroundRemover}>
      <QueryClientProvider>
        <Home />
      </QueryClientProvider>
    </BackgroundRemoverContext.Provider>
  );
}
