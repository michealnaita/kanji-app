import React from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

type AuthState = {
  isEmailVerified: boolean;
  isAuthenticated: boolean;
  user_uid: string;
};

const AuthContext = React.createContext<AuthState | null>(null);
export function useAuth() {
  const state = React.useContext(AuthContext);
  if (!state) throw new Error('Wrap Componet in AuthProvider');
  return state;
}
export default function AuthProvider({ children }: { children: any }) {
  const [isLoading, setLoading] = React.useState(true);
  const [state, setState] = React.useState<AuthState>({
    isEmailVerified: false,
    isAuthenticated: false,
    user_uid: '',
  });
  React.useEffect(() => {
    onAuthStateChanged(
      getAuth(),
      (user) => {
        let isEmailVerified: boolean;
        let isAuthenticated: boolean;
        let user_uid: string;
        if (user) {
          isAuthenticated = true;
          isEmailVerified = user.emailVerified;
          user_uid = user.uid;
          setState({
            isEmailVerified,
            isAuthenticated,
            user_uid,
          });
        }
        setLoading(false);
      },
      (e) => {
        console.log(e);
        setLoading(false);
      }
    );
  }, []);
  return (
    <AuthContext.Provider value={state}>
      {isLoading ? (
        <div className="bg-skin-primary w-full h-full"></div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
