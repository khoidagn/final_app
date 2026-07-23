import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../services/auth.service';
import { getBackendMessage } from '../../../utils/error';
import { authChannel } from '../../../utils/authChannel';

export function useVerifyEmailAction() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(() =>
    token ? 'loading' : 'error'
  );
  const [message, setMessage] = useState<string>(() =>
    token ? '' : 'Invalid or missing verification token.'
  );

  const isCalled = useRef(false);

  useEffect(() => {
    if (!token || isCalled.current) return;
    isCalled.current = true;

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token);
        sessionStorage.removeItem('registeredEmail');
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        toast.success('Email verified successfully!');
        authChannel.postMessage({
          type: 'VERIFY_SUCCESS',
          message: 'Email verified from another tab! Redirecting to login...',
        });
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } catch (error: unknown) {
        setStatus('error');
        const errorMsg = getBackendMessage(
          error,
          'Verification failed or token has expired.'
        );
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    };

    verifyToken();
  }, [token, navigate]);

  return {
    status,
    message,
    navigate,
  };
}
