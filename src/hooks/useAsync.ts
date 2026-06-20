// src/hooks/useAsync.ts
import { useState, useEffect, useCallback } from 'react';

interface UseAsyncOptions<T, E = Error> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: E) => void;
}

interface UseAsyncState<T, E = Error> {
  data: T | null;
  error: E | null;
  loading: boolean;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useAsync<T, E = Error>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions<T, E> = {}
): UseAsyncState<T, E> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { immediate = false, onSuccess, onError } = options;

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      setData(null);
      
      try {
        const result = await asyncFunction(...args);
        setData(result);
        onSuccess?.(result);
      } catch (err) {
        setError(err as E);
        onError?.(err as E);
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    error,
    loading,
    execute,
    reset,
  };
}
