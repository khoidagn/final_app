interface AxiosBackendError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

/**
 * Extracts the backend error message from an Axios error object or returns a fallback message.
 * @param error The caught error object
 * @param defaultMessage Fallback message if no backend error message is found
 */
export function getBackendMessage(
  error: unknown,
  defaultMessage: string
): string {
  const err = error as AxiosBackendError;
  return err.response?.data?.message || defaultMessage;
}