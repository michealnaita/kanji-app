import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/app';
import { useAuth } from '../../context/auth';
import { routes } from '../../settings';

export default function ProtectedRoute({
  page: Page,
  admin = false,
}: {
  page: React.FC;
  admin?: boolean;
}) {
  const protectedRoutes =
    import.meta.env.PROTECTED_ROUTES === 'off' ? false : true;
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isEmailVerified } = useAuth();
  const { roles } = useApp();
  const isAdmin = roles.includes('admin');
  React.useEffect(() => {
    const s = new URLSearchParams();
    s.set('from', location.pathname);
    if (!isAuthenticated) {
      navigate('/about?' + s.toString());
    } else {
      if (!isEmailVerified) navigate(routes.verifyEmail);
    }
  }, []);
  React.useEffect(() => {
    if (
      protectedRoutes &&
      !!roles.length &&
      admin &&
      !roles.includes('admin')
    ) {
      setTimeout(() => navigate(routes.dashboard), 3000);
    }
  }, [roles]);
  return protectedRoutes && !isAdmin && admin ? (
    <p className="text-black">not authorised</p>
  ) : (
    <Page />
  );
}
