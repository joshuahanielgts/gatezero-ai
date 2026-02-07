// GateZero - Vehicles Data Hook

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Vehicle, VehicleUpdate } from '@/types/database.types';

interface UseVehiclesOptions {
  realtime?: boolean;
}

interface UseVehiclesReturn {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  toggleBlacklist: (vehicleNo: string) => Promise<void>;
}

export function useVehicles(options: UseVehiclesOptions = {}): UseVehiclesReturn {
  const { realtime = false } = options;
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError(new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'));
      setIsLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('vehicles')
      .select('*')
      .order('vehicle_no');

    if (fetchError) {
      setError(new Error(fetchError.message));
    } else {
      setVehicles(data || []);
    }

    setIsLoading(false);
  }, []);

  const toggleBlacklist = useCallback(async (vehicleNo: string) => {
    if (!isSupabaseConfigured()) {
      setError(new Error('Supabase not configured'));
      return;
    }

    const vehicle = vehicles.find(v => v.vehicle_no === vehicleNo);
    if (!vehicle) return;

    const newBlacklistStatus = !vehicle.is_blacklisted;

    // Optimistic update
    setVehicles(prev =>
      prev.map(v =>
        v.vehicle_no === vehicleNo
          ? { ...v, is_blacklisted: newBlacklistStatus }
          : v
      )
    );

    const { error: updateError } = await supabase
      .from('vehicles')
      // @ts-expect-error - Supabase type inference issue with update method
      .update({ is_blacklisted: newBlacklistStatus })
      .eq('vehicle_no', vehicleNo);

    if (updateError) {
      // Revert on error
      setVehicles(prev =>
        prev.map(v =>
          v.vehicle_no === vehicleNo
            ? { ...v, is_blacklisted: !newBlacklistStatus }
            : v
        )
      );
      setError(new Error(updateError.message));
    }
  }, [vehicles]);

  useEffect(() => {
    fetchVehicles();

    if (realtime && isSupabaseConfigured()) {
      const channel = supabase
        .channel('vehicles-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'vehicles' },
          () => {
            fetchVehicles();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchVehicles, realtime]);

  return {
    vehicles,
    isLoading,
    error,
    refetch: fetchVehicles,
    toggleBlacklist,
  };
}
