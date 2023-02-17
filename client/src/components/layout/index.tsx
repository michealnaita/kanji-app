import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useApp } from '../../context/app';
import Header from './header';

export default function Layout({ children }: { children: any }) {
  const { current_amount, username, isAuthenticated } = useApp();
  // React.useEffect(() => {
  //   setTimeout(function () {
  //     window.scrollTo(0, document.body.scrollHeight);
  //   }, 1000);
  // }, []);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="light"
      />
      <div className="bg-skin-primary w-screen overflow-y-scroll h-full border-b-4 border-skin-primary flex flex-col">
        <Header
          amount={current_amount}
          username={username}
          isAuthenticated={isAuthenticated}
        />
        <div className="p-6  flex  flex-col container space-y-6 flex-1 overflow-y-scroll">
          {children}
        </div>
      </div>
    </>
  );
}
