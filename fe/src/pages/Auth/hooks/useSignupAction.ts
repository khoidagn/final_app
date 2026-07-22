import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../../services/auth.service';
import { getBackendMessage } from '../../../utils/error';
import { SIGNUP_CONSTANTS } from '../constants/signup.constant';

export function useSignUpAction() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      const msg = SIGNUP_CONSTANTS.VALIDATION.EMAIL_REQUIRED;
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      const msg = SIGNUP_CONSTANTS.VALIDATION.NAME_REQUIRED;
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }
    if (!password.trim()) {
      const msg = SIGNUP_CONSTANTS.VALIDATION.PASSWORD_REQUIRED;
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = SIGNUP_CONSTANTS.VALIDATION.PASSWORDS_NOT_MATCH;
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
      });

      sessionStorage.setItem('registeredEmail', email.trim());
      const successMsg = SIGNUP_CONSTANTS.API_RESPONSE.REGISTER_SUCCESS;

      setSuccessMessage(successMsg);
      toast.success(successMsg);

      setTimeout(() => {
        navigate('/verify-waiting');
      }, 1500);
    } catch (error: unknown) {
      const errorMsg = getBackendMessage(
        error,
        SIGNUP_CONSTANTS.API_RESPONSE.REGISTER_FAILED
      );
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    firstName,
    lastName,
    password,
    confirmPassword,
    errorMessage,
    successMessage,
    isLoading,
    setEmail,
    setFirstName,
    setLastName,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  };
}
