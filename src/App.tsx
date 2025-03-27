import { useState, type JSX } from 'react';
import { type BackgroundRemover, createImglyBackgroundRemover } from './lib/background-remover';
import { BackgroundRemoverContext } from './contexts/background-remover-context';
import { Home } from './pages/home';

function App(): JSX.Element {
  const [backgroundRemover] = useState<BackgroundRemover>(() => {
    return createImglyBackgroundRemover();
  });

  return (
    <BackgroundRemoverContext.Provider value={backgroundRemover}>
      <Home />
    </BackgroundRemoverContext.Provider>
  );
}

export default App;
