import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { AUTH_MESSAGES } from '../constants/message';
import { UserRole } from '../types/auth.types';

export function useLoginActions() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

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
      setErrorMessage(AUTH_MESSAGES.VALIDATION.BOTH_REQUIRED);
      return;
    }
    if (!hasEmail) {
      setErrorMessage(AUTH_MESSAGES.VALIDATION.EMAIL_REQUIRED);
      return;
    }
    if (!hasPassword) {
      setErrorMessage(AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED);
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
      setErrorMessage(AUTH_MESSAGES.API_ERROR.LOGIN_FAILED);
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
