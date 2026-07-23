import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { authService } from '../../../services/auth.service';
import { SIGNUP_CONSTANTS } from '../constants/signup.constant';
import {
  validateSignUpForm,
  type SignUpFieldErrors,
} from '../validations/signup.validation';

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
}

export function useSignUpAction() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fieldErrors, setFieldErrors] = useState<SignUpFieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    if (fieldErrors.firstName)
      setFieldErrors((prev) => ({ ...prev, firstName: undefined }));
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    if (fieldErrors.lastName)
      setFieldErrors((prev) => ({ ...prev, lastName: undefined }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (fieldErrors.email)
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (fieldErrors.password)
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (fieldErrors.confirmPassword)
      setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateSignUpForm({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);
    try {
      await authService.register({
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
      });
      sessionStorage.setItem('registeredEmail', email.trim());
      toast.success(SIGNUP_CONSTANTS.API_RESPONSE.REGISTER_SUCCESS);
      setTimeout(() => {
        navigate('/verify-waiting');
      }, 1500);
    } catch (error: unknown) {
      let serverMessage: string = SIGNUP_CONSTANTS.API_RESPONSE.REGISTER_FAILED;
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        const status = error.response.status;
        const backendMsg = error.response.data?.message || '';
        const isEmailTaken =
          status === 400 ||
          status === 409 ||
          /email/i.test(backendMsg) ||
          /registered|exists/i.test(backendMsg);
        if (isEmailTaken) {
          setFieldErrors({
            email: SIGNUP_CONSTANTS.VALIDATION.EMAIL_EXISTS,
          });
          return;
        }
        serverMessage = backendMsg || serverMessage;
      }
      toast.error(serverMessage);
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
    fieldErrors,
    isLoading,
    handleFirstNameChange,
    handleLastNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
  };
}
