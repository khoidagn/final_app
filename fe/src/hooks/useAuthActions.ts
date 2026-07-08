import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import type { AuthUser, LoginInput } from '../types/auth.types';

export function useAuthActions() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await authService.getCurrentSession();
      setIsLoggedIn(session.isLoggedIn);
      setUser(session.user);
    } catch {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshSession();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [refreshSession]);

  const login = useCallback(async (credentials: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const loginInput: LoginInput = {
        email: String(credentials.email || ''),
        password: String(credentials.password || ''),
        ...credentials,
      };
      const data = await authService.login(loginInput);
      setUser(data.data.user);
      setIsLoggedIn(true);
      return data;
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    refreshSession,
  };
}
