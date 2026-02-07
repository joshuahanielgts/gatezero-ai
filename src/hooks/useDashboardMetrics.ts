// GateZero - Dashboard Metrics Hook

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { DashboardMetrics, WeeklyTrendData, RecentGateEvent } from '@/types/database.types';

interface UseDashboardMetricsReturn {
  metrics: DashboardMetrics | null;
  weeklyTrend: WeeklyTrendData[];
  recentEvents: RecentGateEvent[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDashboardMetrics(): UseDashboardMetricsReturn {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyTrendData[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentGateEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError(new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'));
      setIsLoading(false);
      return;
    }

    try {
      // Fetch metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .eq('id', 'current')
        .single();

      if (metricsError && metricsError.code !== 'PGRST116') throw metricsError;
      setMetrics(metricsData || null);

      // Fetch weekly trend from view
      const { data: trendData, error: trendError } = await supabase
        .from('weekly_trend_data')
        .select('*');

      if (trendError && trendError.code !== 'PGRST116') throw trendError;
      setWeeklyTrend(trendData || []);

      // Fetch recent events from view
      const { data: eventsData, error: eventsError } = await supabase
        .from('recent_gate_events')
        .select('*');

      if (eventsError && eventsError.code !== 'PGRST116') throw eventsError;
      setRecentEvents(eventsData || []);

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();

    // Set up realtime subscription for metrics updates
    if (isSupabaseConfigured()) {
      const channel = supabase
        .channel('dashboard-updates')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'gate_logs' },
          () => {
            fetchData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchData]);

  return {
    metrics,
    weeklyTrend,
    recentEvents,
    isLoading,
    error,
    refetch: fetchData,
  };
}
