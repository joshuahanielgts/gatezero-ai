// GateZero - Live Trips Data Hook

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { LiveTrip, TripStatus } from '@/types/database.types';

interface UseLiveTripsOptions {
  status?: TripStatus;
  realtime?: boolean;
}

interface UseLiveTripsReturn {
  trips: LiveTrip[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useLiveTrips(options: UseLiveTripsOptions = {}): UseLiveTripsReturn {
  const { status, realtime = true } = options;
  const [trips, setTrips] = useState<LiveTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError(new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'));
      setIsLoading(false);
      return;
    }

    let query = supabase
      .from('live_trips')
      .select('*')
      .order('departure_time', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(new Error(fetchError.message));
    } else {
      setTrips(data || []);
    }

    setIsLoading(false);
  }, [status]);

  useEffect(() => {
    fetchTrips();

    if (realtime && isSupabaseConfigured()) {
      const channel = supabase
        .channel('live-trips-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'live_trips' },
          () => {
            fetchTrips();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchTrips, realtime]);

  return {
    trips,
    isLoading,
    error,
    refetch: fetchTrips,
  };
}
