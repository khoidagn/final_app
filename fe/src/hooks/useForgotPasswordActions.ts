import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { getBackendMessage } from '../utils/error';
import { FORGOT_PASSWORD_CONSTANTS } from '../constants/forgot-password.constants';

export function useForgotPasswordActions() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      await authService.forgotPassword(email.trim());
      setFeedback({
        type: 'success',
        message: FORGOT_PASSWORD_CONSTANTS.API_RESPONSE.SEND_SUCCESS,
      });
      setCooldown(60);
    } catch (error: unknown) {
      setFeedback({
        type: 'error',
        message: getBackendMessage(
          error,
          FORGOT_PASSWORD_CONSTANTS.API_RESPONSE.SEND_FAILED
        ), 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    cooldown,
    feedback,
    handleSubmit: onSubmit,
  };
}
