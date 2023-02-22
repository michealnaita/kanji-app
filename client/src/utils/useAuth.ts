import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { getUserData } from '../api/getUserData';
import { useApp } from '../context/app';
import { auth } from './firebase';

const useAuth = () => {
  const { isAuthenticated, authenticate, load } = useApp();
  const [isLoading, setLoading] = React.useState(true);
  const [isAuth, setAuth] = React.useState(false);
  const [error, setError] = React.useState<any>(null);
  React.useEffect(() => {
    console.log('here');
    if (isAuthenticated) {
      setAuth(true);
      setLoading(false);
    } else {
      onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            const userData = await getUserData({ queryKey: [user.uid] });
            load(userData);
            authenticate();
            setAuth(true);
          }
          setLoading(false);
        } catch (e) {
          console.log(e);
          setError(e);
          setLoading(false);
        }
      });
    }
  }, []);

  return { isLoading, isAuth, error };
};

export default useAuth;
