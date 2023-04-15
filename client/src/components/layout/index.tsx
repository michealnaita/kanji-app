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
  const { current_amount, username, isAuthenticated } = useApp();
  // React.useEffect(() => {
  //   setTimeout(function () {
  //     window.scrollTo(0, document.body.scrollHeight);
  //   }, 1000);
  // }, []);
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
      <div className="bg-skin-primary w-screen overflow-y-scroll h-full  flex flex-col">
        <>
          {!hide && (
            <Header
              amount={current_amount}
              username={username}
              isAuthenticated={isAuthenticated}
            />
          )}
        </>
        <div
          className={cn(
            'flex  flex-col bg-red-10 flex-1 p-6 overflow-y-scroll',
            className
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}
