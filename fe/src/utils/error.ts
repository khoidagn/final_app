interface AxiosBackendError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function getBackendMessage(
  error: unknown,
  defaultMessage: string
): string {
  const err = error as AxiosBackendError;
  return err.response?.data?.message || defaultMessage;
}
