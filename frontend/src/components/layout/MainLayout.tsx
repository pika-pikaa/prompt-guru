import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageTransition } from './PageTransition';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export const MainLayout: FC<MainLayoutProps> = ({ children, className }) => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
        )}
      >
        {/* Header */}
        <Header />

        {/* Page content with transition */}
        <main className={cn('flex-1 p-6', className)}>
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

MainLayout.displayName = 'MainLayout';
