import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';
import { getBackendMessage } from '../../../utils/error';
import { LOGIN_CONSTANTS } from '../constants/login.constant';
import { UserRole } from '../../../types/enum.type';
import {
  validateLoginForm,
  type LoginFieldErrors,
} from '../validations/login.validation';

export function useLoginAction() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('reason') === 'session_expired') {
      toast.error(
        'Your session has expired or your password was changed. Please log in again.'
      );
      searchParams.delete('reason');
      setSearchParams(searchParams, { replace: true });
    }

    const msg = sessionStorage.getItem('toastMessage');
    if (msg) {
      toast.success(msg);
      sessionStorage.removeItem('toastMessage');
    }
  }, [searchParams, setSearchParams]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateLoginForm(email, password);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    try {
      setIsSubmitting(true);

      const userData = await login({
        email: email.trim(),
        password: password.trim(),
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
      toast.error(backendMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    fieldErrors,
    isLoading: isSubmitting,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
}
