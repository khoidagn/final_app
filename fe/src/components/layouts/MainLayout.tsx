import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { cn } from '../../utils/cn';

const MainLayout = () => {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col',
        'bg-background',
        'pb-16 md:pb-0'
      )}
    >
      <Navbar />

      <div
        className={cn(
          'w-full px-6 py-8 flex-1 items-start gap-6 grid',
          'grid-cols-1',
          'md:grid-cols-[180px_1fr]',
          'lg:grid-cols-[120px_1fr_120px]'
        )}
      >
        <Sidebar />

        <main className={cn('w-full min-w-0')}>
          <Outlet />
        </main>

        <div className={cn('hidden lg:block w-[120px]')} />
      </div>
    </div>
  );
};

export default MainLayout;
