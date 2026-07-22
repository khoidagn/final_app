import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../services/auth.service';
import { getBackendMessage } from '../../../utils/error';
import { RESET_PASSWORD_CONSTANTS } from '../constants/reset-password.constant';

export function useResetPasswordAction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token) {
      const msg = RESET_PASSWORD_CONSTANTS.VALIDATION.TOKEN_INVALID;
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }
    if (!password.trim()) {
      const msg = RESET_PASSWORD_CONSTANTS.VALIDATION.PASSWORD_REQUIRED;
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = RESET_PASSWORD_CONSTANTS.VALIDATION.PASSWORDS_NOT_MATCH;
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token: token.trim(),
        newPassword: password.trim(),
      });

      const successMsg = RESET_PASSWORD_CONSTANTS.API_RESPONSE.RESET_SUCCESS;
      toast.success(successMsg);

      sessionStorage.setItem('toastMessage', successMsg);
      navigate('/login');
    } catch (error: unknown) {
      const errorMsg = getBackendMessage(
        error,
        RESET_PASSWORD_CONSTANTS.API_RESPONSE.RESET_FAILED
      );
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    confirmPassword,
    isLoading,
    errorMessage,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    hasToken: Boolean(token),
  };
}
