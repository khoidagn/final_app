import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authChannel, type AuthChannelMessage } from '../utils/authChannel';

export function useAutoRedirectOnSuccess(
  expectedType: AuthChannelMessage['type'],
  defaultToastMsg?: string
) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent<AuthChannelMessage>) => {
      if (event.data?.type === expectedType) {
        toast.success(event.data.message || defaultToastMsg || 'Action completed! Redirecting...');        
        navigate('/login', { replace: true });
      }
    };

    authChannel.addEventListener('message', handleMessage);
    return () => {
      authChannel.removeEventListener('message', handleMessage);
    };
  }, [navigate, expectedType, defaultToastMsg]);
}