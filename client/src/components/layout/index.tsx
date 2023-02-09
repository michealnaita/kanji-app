import React from 'react';
import { useApp } from '../../context/app';
import Header from './header';

export default function Layout({ children }: { children: any }) {
  const { current_amount, username } = useApp();
  return (
    <div className="bg-skin-primary w-screen overflow-y-scroll h-full border-b-4 border-skin-primary">
      <Header amount={current_amount} username={username} />
      <div className="px-6  container space-y-4">{children}</div>
    </div>
  );
}
