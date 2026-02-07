// GateZero - Database Types
// Auto-generated types for Supabase tables

export type UserRole = 'admin' | 'dispatcher' | 'guard';
export type RcStatus = 'Active' | 'Expired' | 'Suspended';
export type VehicleType = 'Truck' | 'Trailer' | 'Container' | 'Tanker' | 'Mini Truck';
export type VerdictType = 'APPROVED' | 'BLOCKED' | 'WARNING';
export type TripStatus = 'Loading' | 'On Route' | 'Delayed' | 'At Destination' | 'Unloading';
export type DriverStatus = 'Active' | 'Inactive' | 'On Leave';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  vehicle_no: string;
  owner_name: string;
  vehicle_type: VehicleType;
  rc_status: RcStatus;
  rc_expiry: string;
  insurance_expiry: string;
  insurance_policy_no: string | null;
  insurer_name: string | null;
  permit_expiry: string | null;
  gstin: string | null;
  is_blacklisted: boolean;
  blacklist_reason: string | null;
  risk_score: number;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  name: string;
  license_no: string;
  license_expiry: string;
  phone: string;
  aadhar_no: string | null;
  address: string | null;
  status: DriverStatus;
  assigned_vehicle_no: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerificationCheck {
  name: string;
  status: 'passed' | 'failed' | 'warning';
  details: string;
  timestamp: string;
}

export interface GateLogMetadata {
  checks: VerificationCheck[];
  errors?: string[];
  api_responses?: {
    vahan: Record<string, unknown>;
    gst: Record<string, unknown>;
    insurance: Record<string, unknown>;
  };
  vehicle_snapshot?: Partial<Vehicle>;
  driver_snapshot?: Partial<Driver>;
}

export interface GateLog {
  id: string;
  timestamp: string;
  vehicle_no: string;
  eway_bill_no: string;
  verdict: VerdictType;
  scan_duration_ms: number;
  compliance_score: number;
  operator_id: string | null;
  operator_ip: string | null;
  qr_code_hash: string | null;
  metadata: GateLogMetadata;
  created_at: string;
}

export interface LiveTrip {
  id: string;
  vehicle_no: string;
  driver_id: string | null;
  eway_bill_no: string;
  origin: string;
  destination: string;
  departure_time: string;
  eta: string;
  status: TripStatus;
  distance_km: number;
  progress_percent: number;
  last_location_update: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  id: string;
  risk_score: number;
  active_blocks: number;
  saved_penalties_inr: number;
  compliance_rate: number;
  total_scans_today: number;
  total_approved_today: number;
  total_blocked_today: number;
  updated_at: string;
}

export interface WeeklyTrendData {
  day: string;
  approved: number;
  blocked: number;
}

export interface RecentGateEvent {
  id: string;
  vehicle_no: string;
  verdict: VerdictType;
  timestamp: string;
  eway_bill_no: string;
  compliance_score: number;
}

// Explicit Insert/Update types for better type inference
export type VehicleInsert = Omit<Vehicle, 'created_at' | 'updated_at' | 'risk_score'> & { risk_score?: number };
export type VehicleUpdate = Partial<Omit<Vehicle, 'vehicle_no' | 'created_at' | 'updated_at'>>;
export type GateLogInsert = Omit<GateLog, 'id' | 'created_at'>;

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      vehicles: {
        Row: Vehicle;
        Insert: VehicleInsert;
        Update: VehicleUpdate;
      };
      drivers: {
        Row: Driver;
        Insert: Omit<Driver, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Driver, 'id' | 'created_at' | 'updated_at'>>;
      };
      gate_logs: {
        Row: GateLog;
        Insert: GateLogInsert;
        Update: Partial<Omit<GateLog, 'id' | 'created_at'>>;
      };
      live_trips: {
        Row: LiveTrip;
        Insert: Omit<LiveTrip, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<LiveTrip, 'id' | 'created_at' | 'updated_at'>>;
      };
      dashboard_metrics: {
        Row: DashboardMetrics;
        Insert: Omit<DashboardMetrics, 'updated_at'>;
        Update: Partial<Omit<DashboardMetrics, 'id' | 'updated_at'>>;
      };
    };
    Views: {
      weekly_trend_data: {
        Row: WeeklyTrendData;
      };
      recent_gate_events: {
        Row: RecentGateEvent;
      };
    };
    Functions: {
      calculate_vehicle_risk_score: {
        Args: { v_vehicle_no: string };
        Returns: number;
      };
    };
  };
}
