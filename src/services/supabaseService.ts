// GateZero - Supabase Service
// Database operations and real-time subscriptions

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Database features will be limited.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Type definitions for database tables
export interface DbVehicle {
  id: string;
  org_id: string;
  registration_number: string;
  vehicle_type: string;
  make?: string;
  model?: string;
  year?: number;
  rc_expiry?: string;
  insurance_expiry?: string;
  fitness_expiry?: string;
  permit_expiry?: string;
  puc_expiry?: string;
  status: 'active' | 'inactive' | 'flagged';
  compliance_score: number;
  last_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DbDriver {
  id: string;
  org_id: string;
  name: string;
  license_number: string;
  license_type: string;
  license_expiry?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  verification_status: 'verified' | 'pending' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface DbScan {
  id: string;
  org_id: string;
  vehicle_id?: string;
  driver_id?: string;
  scan_type: 'quick' | 'detailed' | 'bulk';
  vehicle_number: string;
  driver_name?: string;
  result: 'pass' | 'fail' | 'warning';
  compliance_score: number;
  issues: string[];
  ai_insights?: object;
  location?: string;
  scanned_by: string;
  created_at: string;
}

// Vehicle Operations
export async function getVehicles(orgId: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  return supabase
    .from('vehicles')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });
}

export async function getVehicleByNumber(registrationNumber: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  return supabase
    .from('vehicles')
    .select('*')
    .eq('registration_number', registrationNumber.toUpperCase())
    .single();
}

export async function upsertVehicle(vehicle: Partial<DbVehicle>) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  return supabase
    .from('vehicles')
    .upsert(vehicle, { onConflict: 'registration_number' })
    .select()
    .single();
}

export async function updateVehicleCompliance(id: string, score: number, verifiedAt: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  return supabase
    .from('vehicles')
    .update({ 
      compliance_score: score, 
      last_verified_at: verifiedAt,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
}

// Driver Operations
export async function getDrivers(orgId: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  return supabase
    .from('drivers')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });
}

export async function getDriverByLicense(licenseNumber: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  return supabase
    .from('drivers')
    .select('*')
    .eq('license_number', licenseNumber.toUpperCase())
    .single();
}

export async function upsertDriver(driver: Partial<DbDriver>) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  return supabase
    .from('drivers')
    .upsert(driver, { onConflict: 'license_number' })
    .select()
    .single();
}

// Scan Operations
export async function createScan(scan: Omit<DbScan, 'id' | 'created_at'>) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  return supabase
    .from('scans')
    .insert(scan)
    .select()
    .single();
}

export async function getScans(orgId: string, options?: { 
  limit?: number; 
  offset?: number;
  result?: 'pass' | 'fail' | 'warning';
}) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  let query = supabase
    .from('scans')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (options?.result) {
    query = query.eq('result', options.result);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  return query;
}

export async function getScanStats(orgId: string, days: number = 30) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  
  return supabase
    .from('scans')
    .select('result, compliance_score, created_at')
    .eq('org_id', orgId)
    .gte('created_at', fromDate.toISOString());
}

// Alert Operations
export async function getAlerts(orgId: string, status?: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  let query = supabase
    .from('alerts')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  return query;
}

export async function updateAlertStatus(id: string, status: string, userId?: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  interface AlertUpdate {
    status: string;
    updated_at: string;
    acknowledged_by?: string;
    acknowledged_at?: string;
    resolved_by?: string;
    resolved_at?: string;
  }
  
  const updates: AlertUpdate = { 
    status, 
    updated_at: new Date().toISOString() 
  };

  if (status === 'acknowledged' && userId) {
    updates.acknowledged_by = userId;
    updates.acknowledged_at = new Date().toISOString();
  } else if (status === 'resolved' && userId) {
    updates.resolved_by = userId;
    updates.resolved_at = new Date().toISOString();
  }

  return supabase
    .from('alerts')
    .update(updates)
    .eq('id', id);
}

export async function createAlert(alert: {
  org_id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  entity_type?: string;
  entity_id?: string;
}) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  return supabase
    .from('alerts')
    .insert({ ...alert, status: 'active' })
    .select()
    .single();
}

// Real-time subscriptions
export function subscribeToAlerts(orgId: string, callback: (alert: Record<string, unknown>) => void) {
  if (!supabase) return null;
  
  return supabase
    .channel(`alerts:${orgId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'alerts',
      filter: `org_id=eq.${orgId}`,
    }, (payload) => {
      callback(payload.new as Record<string, unknown>);
    })
    .subscribe();
}

export function subscribeToScans(orgId: string, callback: (scan: Record<string, unknown>) => void) {
  if (!supabase) return null;
  
  return supabase
    .channel(`scans:${orgId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'scans',
      filter: `org_id=eq.${orgId}`,
    }, (payload) => {
      callback(payload.new as Record<string, unknown>);
    })
    .subscribe();
}

// Analytics queries
export async function getComplianceOverTime(orgId: string, days: number = 30) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  
  // This would ideally be a database function for efficiency
  const { data, error } = await supabase
    .from('scans')
    .select('compliance_score, created_at')
    .eq('org_id', orgId)
    .gte('created_at', fromDate.toISOString())
    .order('created_at', { ascending: true });

  if (error || !data) return { data: null, error };

  // Group by date and calculate average
  const grouped = data.reduce((acc: Record<string, { total: number; count: number }>, scan) => {
    const date = scan.created_at.split('T')[0];
    if (!acc[date]) {
      acc[date] = { total: 0, count: 0 };
    }
    acc[date].total += scan.compliance_score;
    acc[date].count += 1;
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([date, { total, count }]) => ({
    date,
    compliance: Math.round(total / count),
  }));

  return { data: chartData, error: null };
}

export async function getFleetStats(orgId: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  
  const [vehiclesResult, driversResult] = await Promise.all([
    supabase
      .from('vehicles')
      .select('status, compliance_score')
      .eq('org_id', orgId),
    supabase
      .from('drivers')
      .select('status, verification_status')
      .eq('org_id', orgId),
  ]);

  if (vehiclesResult.error || driversResult.error) {
    return { data: null, error: vehiclesResult.error || driversResult.error };
  }

  const vehicles = vehiclesResult.data || [];
  const drivers = driversResult.data || [];

  return {
    data: {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'active').length,
      flaggedVehicles: vehicles.filter(v => v.status === 'flagged').length,
      averageCompliance: vehicles.length > 0 
        ? Math.round(vehicles.reduce((sum, v) => sum + v.compliance_score, 0) / vehicles.length)
        : 0,
      totalDrivers: drivers.length,
      verifiedDrivers: drivers.filter(d => d.verification_status === 'verified').length,
      activeDrivers: drivers.filter(d => d.status === 'active').length,
    },
    error: null,
  };
}
