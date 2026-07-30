/**
 * Extract a user-friendly error message from any error type.
 * Never returns raw JSON.stringify output.
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    // Axios error with response from server
    if ('response' in error) {
      const axiosErr = error as { response: { data?: { message?: string; error?: string } } };
      const msg = axiosErr.response?.data?.message ?? axiosErr.response?.data?.error;
      if (msg) return msg;
    }

    // Standard Error instance
    if (error instanceof Error) return error.message;

    // Any object with a message field
    if ('message' in error) return String((error as { message: string }).message);
  }

  return 'Что-то пошло не так';
}
