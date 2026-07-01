import { useState, useEffect } from 'react';
import { authService, type AuthUser } from '../services/auth.service';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    authService
      .getCurrentSession()
      .then((session) => {
        setIsLoggedIn(session.isLoggedIn);
        setUser(session.user);
      })
      .catch((err) => {
        console.error('Lỗi kiểm tra trạng thái login:', err);
        setIsLoggedIn(false);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    isLoggedIn,
    user,
    isLoading,
  };
}
