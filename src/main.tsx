import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/index.tsx';

function initApp(): void {
  const appRootElement = document.getElementById('root');

  if (appRootElement === null) {
    throw new Error('Root element not found');
  }

  createRoot(appRootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

initApp();
