import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useToast } from './useToast';
import { getBackendMessage } from '../utils/error';
import { RESET_PASSWORD_CONSTANTS } from '../constants/reset-password.constants';

export function useResetPasswordActions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token) {
      setErrorMessage(RESET_PASSWORD_CONSTANTS.VALIDATION.TOKEN_INVALID);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(RESET_PASSWORD_CONSTANTS.VALIDATION.PASSWORDS_NOT_MATCH);
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token: token.trim(),
        newPassword: password.trim(),
      });

      showToast(RESET_PASSWORD_CONSTANTS.API_RESPONSE.RESET_SUCCESS, 'success');
      navigate('/login');
    } catch (error: unknown) {
      setErrorMessage(
        getBackendMessage(
          error,
          RESET_PASSWORD_CONSTANTS.API_RESPONSE.RESET_FAILED
        ) 
      );
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
    hasToken: !!token,
  };
}
