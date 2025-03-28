import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from '@tanstack/react-query';
import { useState, type JSX, type ReactNode } from 'react';

interface QueryClientProviderProps {
  children: ReactNode;
}

export function QueryClientProvider({ children }: QueryClientProviderProps): JSX.Element {
  const [queryClient] = useState<QueryClient>(() => new QueryClient());

  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>;
}
