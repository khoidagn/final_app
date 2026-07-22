import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { authService } from '../../../services/auth.service';
import { getBackendMessage } from '../../../utils/error';
import { FORGOT_PASSWORD_CONSTANTS } from '../constants/forgot-password.constant';

export function useForgotPasswordAction() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      const msg = FORGOT_PASSWORD_CONSTANTS.VALIDATION.EMAIL_REQUIRED;
      setFeedback({ type: 'error', message: msg });
      toast.warning(msg);
      return;
    }

    if (cooldown > 0) {
      const msg = FORGOT_PASSWORD_CONSTANTS.COOLDOWN_MESSAGE(cooldown);
      toast.warning(msg);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      await authService.forgotPassword(trimmedEmail);
      const successMsg = FORGOT_PASSWORD_CONSTANTS.API_RESPONSE.SEND_SUCCESS;

      setFeedback({ type: 'success', message: successMsg });
      toast.success(successMsg);
      setCooldown(60);
    } catch (error: unknown) {
      const errorMsg = getBackendMessage(
        error,
        FORGOT_PASSWORD_CONSTANTS.API_RESPONSE.SEND_FAILED
      );

      setFeedback({ type: 'error', message: errorMsg });
      toast.error(errorMsg);
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
