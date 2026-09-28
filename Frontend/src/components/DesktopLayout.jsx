import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DesktopLayout({ children, activePath }) {
  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      <Sidebar activePath={activePath} />
      <div className="pl-64">
        <Header />
        {children}
      </div>
    </div>
  );
}
