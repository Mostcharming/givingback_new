import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { apiGet, type QueryValue } from '@/lib/api';

type QueryOptions = {
  enabled?: boolean;
  query?: Record<string, QueryValue>;
};

export function useApiQuery<T>(path: string, options: QueryOptions = {}) {
  const { session } = useAuth();
  const enabled = options.enabled !== false;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(enabled);
  const queryKey = JSON.stringify(options.query || {});

  const refetch = useCallback(async () => {
    if (!enabled || !session?.token) return null;
    setLoading(true);
    setError(null);
    try {
      const query = JSON.parse(queryKey) as Record<string, QueryValue>;
      const result = await apiGet<T>(path, session.token, query);
      setData(result);
      return result;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  }, [enabled, path, queryKey, session?.token]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    data,
    error,
    loading,
    refetch,
    setData,
  };
}
