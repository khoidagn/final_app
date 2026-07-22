import { type ReactNode } from 'react';
import { useAuthActions } from '../hooks/useAuthAction';
import { AuthContext } from './auth.context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const authActions = useAuthActions();
console.log('[AuthProvider] Current Auth State:', {
    isLoggedIn: authActions.isLoggedIn,
    isLoading: authActions.isLoading,
    userData: authActions.user
  });
  return (
    <AuthContext.Provider value={authActions}>{children}</AuthContext.Provider>
  );
}
