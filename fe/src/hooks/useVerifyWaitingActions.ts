import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useToast } from './useToast';
import { VERIFY_WAITING_CONSTANTS } from '../constants/verify-waiting.constants';
import { getBackendMessage } from '../utils/error';

export function useVerifyWaitingActions() {
  const navigate = useNavigate();
  const { showToast } = useToast();
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

          showToast(
            VERIFY_WAITING_CONSTANTS.API_RESPONSE.VERIFY_SUCCESS,
            'success'
          );

          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    }, 3000);

    return () => clearInterval(checkInterval);
  }, [userEmail, navigate, showToast]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!userEmail || resendLoading) return;
    setResendLoading(true);
    try {
      await authService.resendVerification(userEmail);
      showToast(
        VERIFY_WAITING_CONSTANTS.API_RESPONSE.RESEND_SUCCESS,
        'success'
      );
      setCooldown(60);
    } catch (error: unknown) {
      showToast(
        getBackendMessage(
          error,
          VERIFY_WAITING_CONSTANTS.API_RESPONSE.RESEND_FAILED
        ), 
        'error'
      );
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
