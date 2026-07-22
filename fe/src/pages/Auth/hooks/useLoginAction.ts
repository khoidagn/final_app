import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';
import { getBackendMessage } from '../../../utils/error';
import { LOGIN_CONSTANTS } from '../constants/login.constant';
import { UserRole } from '../../../types/enum.type';

export function useLoginAction() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const msg = sessionStorage.getItem('toastMessage');
    if (msg) {
      toast.success(msg);
      sessionStorage.removeItem('toastMessage');
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    if (emailTrimmed === '' && passwordTrimmed === '') {
      const msg = LOGIN_CONSTANTS.VALIDATION.BOTH_REQUIRED;
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }
    if (emailTrimmed === '') {
      const msg = LOGIN_CONSTANTS.VALIDATION.EMAIL_REQUIRED;
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }
    if (passwordTrimmed === '') {
      const msg = LOGIN_CONSTANTS.VALIDATION.PASSWORD_REQUIRED;
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }

    try {
      const userData = await login({
        email: emailTrimmed,
        password: passwordTrimmed,
      });

      toast.success('Welcome back! Login successful.');

      const currentRole = userData.data?.user?.role;
      if (currentRole === UserRole.ADMIN) {
        navigate('/admin/photos');
      } else if (currentRole === UserRole.USER) {
        navigate('/feeds');
      } else {
        console.warn('Unknown role, redirecting to default feed.');
        navigate('/feeds');
      }
    } catch (error: unknown) {
      const backendMsg = getBackendMessage(
        error,
        LOGIN_CONSTANTS.API_RESPONSE.LOGIN_FAILED
      );
      setErrorMessage(backendMsg);
      toast.error(backendMsg);
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
