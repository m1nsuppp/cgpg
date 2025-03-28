import { cn } from '@/lib/utils/cn';
import type { ReactNode, JSX } from 'react';

interface HomeLayoutProps {
  children: ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps): JSX.Element {
  return (
    <div className={cn('w-screen h-screen flex justify-center items-center', 'bg-gray-300')}>
      {children}
    </div>
  );
}
