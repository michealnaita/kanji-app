import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useGetUserDataMutation from '../../api/user/current';
import { useApp } from '../../context/app';
import { useAuth } from '../../context/auth';
import { routes } from '../../settings';

export default function UserProvider({ Page }: { Page: React.FC }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isEmailVerified, user_uid } = useAuth();
  const { load } = useApp();
  const { data, error, mutate } = useGetUserDataMutation();
  React.useEffect(() => {
    if (data) {
      load({ id: user_uid, ...data });
    }
  }, [data]);
  React.useEffect(() => {
    if (error) {
      navigate('/500');
    }
  }, [error]);
  React.useEffect(() => {
    const s = new URLSearchParams();
    s.set('from', location.pathname);
    if (!isAuthenticated) {
      navigate('/about?' + s.toString());
    } else {
      mutate(user_uid);
      if (!isEmailVerified) navigate(routes.verifyEmail);
    }
  }, []);

  return <>{<Page />}</>;
}
