// GateZero - Drivers Data Hook

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Driver } from '@/types/database.types';

interface UseDriversReturn {
  drivers: Driver[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDrivers(): UseDriversReturn {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDrivers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError(new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'));
      setIsLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('drivers')
      .select('*')
      .order('name');

    if (fetchError) {
      setError(new Error(fetchError.message));
    } else {
      setDrivers(data || []);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return {
    drivers,
    isLoading,
    error,
    refetch: fetchDrivers,
  };
}
