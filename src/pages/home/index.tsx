import { useState, type JSX } from 'react';
import { HomeLayout } from './home-layout';
import { Stage } from './stage';
import { BackgroundRemoverContext } from './background-remover-context';
import { type BackgroundRemover, createImglyBackgroundRemover } from '@/lib/background-remover';
import { DPRContext } from './dpr-context';

export function Home(): JSX.Element {
  const [backgroundRemover] = useState<BackgroundRemover>(() => createImglyBackgroundRemover());

  return (
    <BackgroundRemoverContext.Provider value={backgroundRemover}>
      <DPRContext.Provider value={window.devicePixelRatio}>
        <HomeLayout>
          <Stage />
        </HomeLayout>
      </DPRContext.Provider>
    </BackgroundRemoverContext.Provider>
  );
}
