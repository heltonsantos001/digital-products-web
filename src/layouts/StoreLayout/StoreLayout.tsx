import React from 'react';
import { Outlet } from 'react-router-dom';

export const StoreLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-navy selection:bg-brand-yellow selection:text-brand-navy">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
