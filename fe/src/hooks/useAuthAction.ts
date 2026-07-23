import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { AUTH_CONSTANTS } from '../constants/auth.constant';
import { getBackendMessage } from '../utils/error';
import type { AuthUser, LoginInput } from '../types/auth.type';

export function useAuthActions() {
  const hasStoredToken =
    typeof window !== 'undefined' &&
    Boolean(localStorage.getItem('accessToken'));

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(hasStoredToken);

  const refreshSession = useCallback(async () => {
    try {
      const response = await userService.getMe();

      if (response && response.success === true && response.data) {
        setUser(response.data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
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
      } else {
        setUser(null);
      }

      setIsLoggedIn(true);
      return data;
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      console.error(
        'Logout API Error:',
        getBackendMessage(error, AUTH_CONSTANTS.API_RESPONSE.LOGOUT_FAILED)
      );
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');

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
