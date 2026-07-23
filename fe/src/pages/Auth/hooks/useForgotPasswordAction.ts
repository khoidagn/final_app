import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { authService } from '../../../services/auth.service';
import { getBackendMessage } from '../../../utils/error';
import { FORGOT_PASSWORD_CONSTANTS } from '../constants/forgot-password.constant';
import {
  validateForgotPasswordForm,
  type ForgotPasswordErrors,
} from '../validations/forgot-password.validation';

export function useForgotPasswordAction() {
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ForgotPasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false); // State kiểm soát Step 1 (Form) & Step 2 (Success View)
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const sendResetLink = async () => {
    const trimmedEmail = email.trim();

    const errors = validateForgotPasswordForm(trimmedEmail);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (cooldown > 0) {
      toast.warning(FORGOT_PASSWORD_CONSTANTS.COOLDOWN_MESSAGE(cooldown));
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setFieldErrors({});

    try {
      await authService.forgotPassword(trimmedEmail);
      const successMsg = FORGOT_PASSWORD_CONSTANTS.API_RESPONSE.SUCCESS;

      toast.success(successMsg);
      setIsSent(true);
      setCooldown(60);
    } catch (error: unknown) {
      const errorMsg = getBackendMessage(
        error,
        FORGOT_PASSWORD_CONSTANTS.API_RESPONSE.FAILED
      );
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data as
          | { message?: string }
          | undefined;
        const backendMsg = responseData?.message || errorMsg;

        const isNotFound =
          status === 404 ||
          status === 400 ||
          /not found/i.test(backendMsg) ||
          /exist/i.test(backendMsg) ||
          /user/i.test(backendMsg);

        if (isNotFound) {
          setFieldErrors({
            email: 'We couldn’t find an account with that email address.',
          });
          return;
        }
      }

      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendResetLink();
  };

  const handleResend = async () => {
    await sendResetLink();
  };

  return {
    email,
    fieldErrors,
    isLoading,
    isSent,
    setIsSent,
    cooldown,
    handleEmailChange,
    handleSubmit,
    handleResend,
  };
}
