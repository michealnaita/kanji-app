import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/app';

export default function ProtectedRoute({ Route }: { Route: React.FC }) {
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  React.useEffect(() => {
    const s = new URLSearchParams();
    s.set('from', location.pathname);
    if (!isAuthenticated) navigate('/signin?' + s.toString());
  }, [isAuthenticated]);
  return <>{isAuthenticated && <Route />}</>;
}
