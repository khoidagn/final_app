import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { getBackendMessage } from '../utils/error';
import { LOGIN_CONSTANTS } from '../constants/login.constants';
import { UserRole } from '../types/auth.types';

export function useLoginActions() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const msg = sessionStorage.getItem('toastMessage');
    if (msg) {
      showToast(msg, 'success');
      sessionStorage.removeItem('toastMessage');
    }
  }, [showToast]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const hasEmail = !!email.trim();
    const hasPassword = !!password.trim();

    if (!hasEmail && !hasPassword) {
      setErrorMessage(LOGIN_CONSTANTS.VALIDATION.BOTH_REQUIRED);
      return;
    }
    if (!hasEmail) {
      setErrorMessage(LOGIN_CONSTANTS.VALIDATION.EMAIL_REQUIRED);
      return;
    }
    if (!hasPassword) {
      setErrorMessage(LOGIN_CONSTANTS.VALIDATION.PASSWORD_REQUIRED);
      return;
    }

    try {
      await login({ email, password });
      const userRole = localStorage.getItem('role');

      if (userRole === UserRole.ADMIN) {
        navigate('/admin/photos');
      } else if (userRole === UserRole.USER) {
        navigate('/feeds');
      } else {
        console.warn('Unknown role, redirecting to default feed.');
        navigate('/feeds');
      }
    } catch (error: unknown) {
      setErrorMessage(
        getBackendMessage(error, 'LOGIN_CONSTANTS.API_RESPONSE.LOGIN_FAILED')
      );
    }
  };

  return {
    email,
    password,
    errorMessage,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
}
