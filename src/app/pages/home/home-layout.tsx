import { cn } from '@/lib/utils/cn';
import type { ReactNode, JSX } from 'react';

interface HomeLayoutProps {
  children: ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps): JSX.Element {
  return (
    <div className={cn('flex justify-center items-center', 'w-screen h-screen')}>{children}</div>
  );
}
