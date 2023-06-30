import { ToastContainer } from 'react-toastify';
import { toast, Toaster } from 'react-hot-toast';
import { useApp } from '../../context/app';
import Header from './header';
import { Helmet } from 'react-helmet';
import cn from 'classnames';
import React from 'react';
import { settings } from '../../settings';

export default function Layout({
  children,
  title,
  hide,
  className,
}: {
  children: any;
  hide?: true;
  title: string;
  className?: string;
}) {
  const { notifications, firstname } = useApp();
  React.useEffect(() => {
    toast.dismiss();
  }, []);
  return (
    <>
      <Helmet>
        <title>{title + ' | ' + settings.appName}</title>
      </Helmet>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="light"
      />
      <Toaster toastOptions={{ duration: 2000 }} />
      <div className="bg-skin-primary w-screen overflow-y-auto h-full  flex flex-col">
        <p className="w-full text-red-500 text-center text-xs">
          Please note that this application is now soley demonstrational
        </p>
        <>
          {!hide && (
            <Header notifications={notifications} username={firstname} />
          )}
        </>
        <div
          className={cn(
            'flex  flex-col bg-red-10 flex-1 p-6 overflow-y-auto',
            className
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}
