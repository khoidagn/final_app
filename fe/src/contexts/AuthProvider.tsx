import { type ReactNode } from 'react';
import { useAuthActions } from '../hooks/useAuthActions';
import { AuthContext } from './auth.context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const authActions = useAuthActions();

  return (
    <AuthContext.Provider value={authActions}>{children}</AuthContext.Provider>
  );
}
