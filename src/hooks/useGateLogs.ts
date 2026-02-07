// GateZero - Gate Logs Data Hook

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { GateLog, VerdictType } from '@/types/database.types';

interface UseGateLogsOptions {
  limit?: number;
  verdict?: VerdictType;
  realtime?: boolean;
}

interface UseGateLogsReturn {
  logs: GateLog[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useGateLogs(options: UseGateLogsOptions = {}): UseGateLogsReturn {
  const { limit = 20, verdict, realtime = false } = options;
  const [logs, setLogs] = useState<GateLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = useCallback(async (reset = false) => {
    setIsLoading(true);
    setError(null);

    const currentOffset = reset ? 0 : offset;

    if (!isSupabaseConfigured()) {
      setError(new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'));
      setIsLoading(false);
      return;
    }

    let query = supabase
      .from('gate_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .range(currentOffset, currentOffset + limit - 1);

    if (verdict) {
      query = query.eq('verdict', verdict);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(new Error(fetchError.message));
    } else {
      if (reset) {
        setLogs(data || []);
      } else {
        setLogs(prev => [...prev, ...(data || [])]);
      }
      setHasMore((data?.length || 0) === limit);
      setOffset(currentOffset + limit);
    }

    setIsLoading(false);
  }, [offset, limit, verdict]);

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await fetchLogs(false);
    }
  }, [fetchLogs, isLoading, hasMore]);

  useEffect(() => {
    fetchLogs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verdict]);

  useEffect(() => {
    if (realtime && isSupabaseConfigured()) {
      const channel = supabase
        .channel('gate-logs-changes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'gate_logs' },
          () => {
            fetchLogs(true);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchLogs, realtime]);

  return {
    logs,
    isLoading,
    error,
    refetch: () => fetchLogs(true),
    hasMore,
    loadMore,
  };
}
