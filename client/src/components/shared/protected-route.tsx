import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../utils/useAuth';
import Logo from '../../assets/logo-white.svg';

export default function ProtectedRoute({
  Route,
  partial,
}: {
  Route: React.FC;
  partial?: true;
}) {
  const { isAuth, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  React.useEffect(() => {
    const s = new URLSearchParams();
    s.set('from', location.pathname);
    if (!isAuth && !isLoading && !partial) navigate('/about?' + s.toString());
    if (error && !isLoading) navigate('/500');
  }, [isAuth, isLoading, error]);
  return (
    <>
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <img
            src={Logo}
            alt="logo"
            width={30}
            className="animate-bounce animate-ping"
          />
        </div>
      ) : (
        <>{(partial || isAuth) && <Route />}</>
      )}
    </>
  );
}
