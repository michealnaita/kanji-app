import { ToastContainer } from 'react-toastify';
import { useApp } from '../../context/app';
import Header from './header';
import { Helmet } from 'react-helmet';
import cn from 'classnames';

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
  const { notifications, firstname, isAuthenticated } = useApp();
  return (
    <>
      <Helmet>
        <title>{title + ' | Littleneck'}</title>
      </Helmet>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="light"
      />
      <div className="bg-skin-primary w-screen overflow-y-auto h-full  flex flex-col">
        <>
          {!hide && (
            <Header
              notifications={notifications}
              username={firstname}
              isAuthenticated={isAuthenticated}
            />
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
