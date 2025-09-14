import { useState, useCallback } from 'react';

export interface UseMutationOptions<T, V> {
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: string, variables: V) => void;
  onSettled?: (data: T | null, error: string | null, variables: V) => void;
}

export function useApiMutation<T, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options: UseMutationOptions<T, V> = {}
) {
  const { onSuccess, onError, onSettled } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (variables: V) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(variables);
      setData(result);
      onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(errorMessage, variables);
      throw err;
    } finally {
      setLoading(false);
      onSettled?.(data, error, variables);
    }
  }, [mutationFn, onSuccess, onError, onSettled, data, error]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
    isIdle: !loading && !error && !data,
    isError: !!error,
    isSuccess: !!data && !error,
    isLoading: loading,
  };
}
