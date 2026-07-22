import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../services/auth.service';
import { VERIFY_WAITING_CONSTANTS } from '../constants/verify-waiting.constant';
import { getBackendMessage } from '../../../utils/error';

export function useVerifyWaitingAction() {
  const navigate = useNavigate();
  const [isConfirmedSuccess, setIsConfirmedSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const userEmail = sessionStorage.getItem('registeredEmail') || '';

  useEffect(() => {
    if (!userEmail) return;

    const checkInterval = setInterval(async () => {
      try {
        const isConfirmed =
          await authService.checkVerificationStatus(userEmail);

        if (isConfirmed) {
          setIsConfirmedSuccess(true);
          clearInterval(checkInterval);

          sessionStorage.removeItem('registeredEmail');

          const successMsg =
            VERIFY_WAITING_CONSTANTS.API_RESPONSE.VERIFY_SUCCESS;
          toast.success(successMsg);

          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      } catch (error: unknown) {
        console.error('Error checking verification status:', error);
      }
    }, 3000);

    return () => clearInterval(checkInterval);
  }, [userEmail, navigate]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!userEmail || resendLoading) return;

    if (cooldown > 0) {
      toast.warning(VERIFY_WAITING_CONSTANTS.COOLDOWN_MESSAGE(cooldown));
      return;
    }

    setResendLoading(true);
    try {
      await authService.resendVerification(userEmail);
      toast.success(VERIFY_WAITING_CONSTANTS.API_RESPONSE.RESEND_SUCCESS);
      setCooldown(60);
    } catch (error: unknown) {
      const errorMsg = getBackendMessage(
        error,
        VERIFY_WAITING_CONSTANTS.API_RESPONSE.RESEND_FAILED
      );
      toast.error(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  return {
    userEmail,
    isConfirmedSuccess,
    resendLoading,
    cooldown,
    handleResend,
  };
}
