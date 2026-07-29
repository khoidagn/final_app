import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { AUTH_CONSTANTS } from '../constants/auth.constant';
import { getBackendMessage } from '../utils/error';
import type { AuthUser, LoginInput } from '../types/auth.type';

const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('authUser');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export function useAuthActions() {
  const hasStoredToken =
    typeof window !== 'undefined' &&
    Boolean(localStorage.getItem('accessToken'));

  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => hasStoredToken && Boolean(getStoredUser())
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    hasStoredToken && !getStoredUser()
  );

  const refreshSession = useCallback(async () => {
    try {
      const response = await userService.getMe();

      if (response && response.success === true && response.data) {
        setUser(response.data);
        setIsLoggedIn(true);
        localStorage.setItem('authUser', JSON.stringify(response.data));
      } else {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('authUser');
      }
    } catch (error: unknown) {
      console.error(
        'Session restore error:',
        getBackendMessage(
          error,
          AUTH_CONSTANTS.API_RESPONSE.SESSION_RESTORE_FAILED
        )
      );
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasStoredToken) {
      return;
    }

    const timer = window.setTimeout(() => {
      void refreshSession();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [hasStoredToken, refreshSession]);

  const login = useCallback(async (credentials: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const loginInput: LoginInput = {
        email: String(credentials.email || ''),
        password: String(credentials.password || ''),
        ...credentials,
      };

      const data = await authService.login(loginInput);
      const response = await userService.getMe();

      if (response && response.success === true && response.data) {
        setUser(response.data);
        localStorage.setItem('authUser', JSON.stringify(response.data));
      } else {
        setUser(null);
        localStorage.removeItem('authUser');
      }

      setIsLoggedIn(true);
      return data;
    } catch (error: unknown) {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('authUser');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error: unknown) {
      console.error(
        'Logout API Error:',
        getBackendMessage(error, AUTH_CONSTANTS.API_RESPONSE.LOGOUT_FAILED)
      );
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('authUser');

      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);

      toast.info(AUTH_CONSTANTS.API_RESPONSE.LOGOUT_SUCCESS);
      window.location.href = '/discovery';
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
