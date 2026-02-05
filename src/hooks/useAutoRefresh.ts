import { useState, useEffect, useCallback } from "react";

interface UseAutoRefreshOptions {
  interval?: number;
  enabled?: boolean;
}

export function useAutoRefresh<T>(
  fetchData: () => T,
  options: UseAutoRefreshOptions = {}
) {
  const { interval = 30000, enabled = true } = options;
  const [data, setData] = useState<T>(fetchData);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate network delay for visual feedback
    setTimeout(() => {
      setData(fetchData());
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 300);
  }, [fetchData]);

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(refresh, interval);
    return () => clearInterval(timer);
  }, [interval, enabled, refresh]);

  return { data, lastUpdated, isRefreshing, refresh };
}
