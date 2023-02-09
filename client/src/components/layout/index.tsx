import React from 'react';
import Header from './header';

export default function Layout({ children }: { children: any }) {
  return (
    <div className="bg-skin-primary w-screen h-full border-b-4 border-skin-primary">
      <Header amount={15000} username={'michealnaita'} />
      <div className="px-6  container space-y-4">{children}</div>
    </div>
  );
}
