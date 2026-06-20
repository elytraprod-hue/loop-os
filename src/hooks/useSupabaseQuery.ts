// src/hooks/useSupabaseQuery.ts
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';

export function useSupabaseQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<T, Error> {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}
