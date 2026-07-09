import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { getBackendMessage } from '../utils/error';
import { SIGNUP_CONSTANTS } from '../constants/signup.constants';

export function useSignUpActions() {
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
      setErrorMessage(SIGNUP_CONSTANTS.VALIDATION.EMAIL_REQUIRED);
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage(SIGNUP_CONSTANTS.VALIDATION.NAME_REQUIRED);
      return;
    }
    if (!password.trim()) {
      setErrorMessage(SIGNUP_CONSTANTS.VALIDATION.PASSWORD_REQUIRED);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(SIGNUP_CONSTANTS.VALIDATION.PASSWORDS_NOT_MATCH);
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
      setSuccessMessage(SIGNUP_CONSTANTS.API_RESPONSE.REGISTER_SUCCESS);

      setTimeout(() => {
        navigate('/verify-waiting');
      }, 1500);
    } catch (error: unknown) {
      setErrorMessage(
        getBackendMessage(error, SIGNUP_CONSTANTS.API_RESPONSE.REGISTER_FAILED)
      );
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
