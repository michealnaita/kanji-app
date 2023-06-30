import React from 'react';

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
  const [isLoading, setLoading] = React.useState(false);
  const [state, setState] = React.useState<AuthState>({
    isEmailVerified: true,
    isAuthenticated: true,
    user_uid: '23egvhsjdfzvuyw35er98ow5ets8guh',
  });
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
