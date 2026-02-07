-- GateZero - Database Schema
-- Compliance Firewall for Logistics | SNR Automations

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('admin', 'dispatcher', 'guard');
CREATE TYPE rc_status AS ENUM ('Active', 'Expired', 'Suspended');
CREATE TYPE vehicle_type AS ENUM ('Truck', 'Trailer', 'Container', 'Tanker', 'Mini Truck');
CREATE TYPE verdict_type AS ENUM ('APPROVED', 'BLOCKED', 'WARNING');
CREATE TYPE trip_status AS ENUM ('Loading', 'On Route', 'Delayed', 'At Destination', 'Unloading');
CREATE TYPE driver_status AS ENUM ('Active', 'Inactive', 'On Leave');

-- =====================================================
-- PROFILES TABLE
-- =====================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'guard',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- VEHICLES TABLE
-- =====================================================

CREATE TABLE vehicles (
  vehicle_no TEXT PRIMARY KEY,
  owner_name TEXT NOT NULL,
  vehicle_type vehicle_type NOT NULL DEFAULT 'Truck',
  rc_status rc_status NOT NULL DEFAULT 'Active',
  rc_expiry DATE NOT NULL,
  insurance_expiry DATE NOT NULL,
  insurance_policy_no TEXT,
  insurer_name TEXT,
  permit_expiry DATE,
  gstin TEXT,
  is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
  blacklist_reason TEXT,
  risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Vehicles policies
CREATE POLICY "All authenticated users can view vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Guards and Dispatchers can insert vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'dispatcher', 'guard')
    )
  );

CREATE POLICY "Only Admins can update vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only Admins can delete vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- DRIVERS TABLE
-- =====================================================

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  license_no TEXT NOT NULL UNIQUE,
  license_expiry DATE NOT NULL,
  phone TEXT NOT NULL,
  aadhar_no TEXT,
  address TEXT,
  status driver_status NOT NULL DEFAULT 'Active',
  assigned_vehicle_no TEXT REFERENCES vehicles(vehicle_no) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Drivers policies
CREATE POLICY "All authenticated users can view drivers"
  ON drivers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and Dispatchers can manage drivers"
  ON drivers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'dispatcher')
    )
  );

-- =====================================================
-- GATE LOGS TABLE (Core Audit Trail)
-- =====================================================

CREATE TABLE gate_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  vehicle_no TEXT NOT NULL,
  eway_bill_no TEXT NOT NULL,
  verdict verdict_type NOT NULL,
  scan_duration_ms INTEGER NOT NULL DEFAULT 0,
  compliance_score INTEGER NOT NULL DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  operator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  operator_ip INET,
  qr_code_hash TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_gate_logs_timestamp ON gate_logs(timestamp DESC);
CREATE INDEX idx_gate_logs_vehicle_no ON gate_logs(vehicle_no);
CREATE INDEX idx_gate_logs_verdict ON gate_logs(verdict);
CREATE INDEX idx_gate_logs_operator ON gate_logs(operator_id);

-- Enable RLS
ALTER TABLE gate_logs ENABLE ROW LEVEL SECURITY;

-- Gate logs policies
CREATE POLICY "All authenticated users can view gate logs"
  ON gate_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Guards can insert gate logs"
  ON gate_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'dispatcher', 'guard')
    )
  );

CREATE POLICY "Only Admins can update gate logs"
  ON gate_logs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only Admins can delete gate logs"
  ON gate_logs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- LIVE TRIPS TABLE
-- =====================================================

CREATE TABLE live_trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_no TEXT NOT NULL REFERENCES vehicles(vehicle_no) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  eway_bill_no TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  eta TIMESTAMPTZ NOT NULL,
  status trip_status NOT NULL DEFAULT 'Loading',
  distance_km INTEGER NOT NULL DEFAULT 0,
  progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_location_update TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_live_trips_status ON live_trips(status);
CREATE INDEX idx_live_trips_vehicle ON live_trips(vehicle_no);

-- Enable RLS
ALTER TABLE live_trips ENABLE ROW LEVEL SECURITY;

-- Live trips policies
CREATE POLICY "All authenticated users can view live trips"
  ON live_trips FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Dispatchers can manage live trips"
  ON live_trips FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'dispatcher')
    )
  );

-- =====================================================
-- DASHBOARD METRICS TABLE (Cached KPIs)
-- =====================================================

CREATE TABLE dashboard_metrics (
  id TEXT PRIMARY KEY DEFAULT 'current',
  risk_score INTEGER NOT NULL DEFAULT 0,
  active_blocks INTEGER NOT NULL DEFAULT 0,
  saved_penalties_inr BIGINT NOT NULL DEFAULT 0,
  compliance_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  total_scans_today INTEGER NOT NULL DEFAULT 0,
  total_approved_today INTEGER NOT NULL DEFAULT 0,
  total_blocked_today INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view metrics"
  ON dashboard_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only system can update metrics"
  ON dashboard_metrics FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Insert default metrics row
INSERT INTO dashboard_metrics (id) VALUES ('current') ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_trips_updated_at
  BEFORE UPDATE ON live_trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate vehicle risk score
CREATE OR REPLACE FUNCTION calculate_vehicle_risk_score(v_vehicle_no TEXT)
RETURNS INTEGER AS $$
DECLARE
  risk INTEGER := 0;
  v_record RECORD;
BEGIN
  SELECT * INTO v_record FROM vehicles WHERE vehicle_no = v_vehicle_no;
  
  IF NOT FOUND THEN
    RETURN 100; -- Unknown vehicle = high risk
  END IF;
  
  -- Blacklisted = immediate high risk
  IF v_record.is_blacklisted THEN
    RETURN 100;
  END IF;
  
  -- RC Status
  IF v_record.rc_status = 'Expired' THEN
    risk := risk + 40;
  ELSIF v_record.rc_status = 'Suspended' THEN
    risk := risk + 50;
  END IF;
  
  -- Insurance expiry
  IF v_record.insurance_expiry < CURRENT_DATE THEN
    risk := risk + 35;
  ELSIF v_record.insurance_expiry < CURRENT_DATE + INTERVAL '7 days' THEN
    risk := risk + 15;
  ELSIF v_record.insurance_expiry < CURRENT_DATE + INTERVAL '30 days' THEN
    risk := risk + 5;
  END IF;
  
  -- Permit expiry
  IF v_record.permit_expiry IS NOT NULL AND v_record.permit_expiry < CURRENT_DATE THEN
    risk := risk + 20;
  END IF;
  
  RETURN LEAST(risk, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to update dashboard metrics
CREATE OR REPLACE FUNCTION update_dashboard_metrics()
RETURNS TRIGGER AS $$
DECLARE
  today_start TIMESTAMPTZ := DATE_TRUNC('day', NOW());
BEGIN
  UPDATE dashboard_metrics
  SET
    total_scans_today = (
      SELECT COUNT(*) FROM gate_logs 
      WHERE timestamp >= today_start
    ),
    total_approved_today = (
      SELECT COUNT(*) FROM gate_logs 
      WHERE timestamp >= today_start AND verdict = 'APPROVED'
    ),
    total_blocked_today = (
      SELECT COUNT(*) FROM gate_logs 
      WHERE timestamp >= today_start AND verdict = 'BLOCKED'
    ),
    active_blocks = (
      SELECT COUNT(*) FROM gate_logs 
      WHERE timestamp >= today_start AND verdict = 'BLOCKED'
    ),
    compliance_rate = (
      SELECT CASE 
        WHEN COUNT(*) > 0 
        THEN ROUND((COUNT(*) FILTER (WHERE verdict = 'APPROVED')::DECIMAL / COUNT(*)) * 100, 2)
        ELSE 100.00
      END
      FROM gate_logs 
      WHERE timestamp >= today_start
    ),
    saved_penalties_inr = (
      SELECT COALESCE(COUNT(*) FILTER (WHERE verdict = 'BLOCKED') * 25000, 0)
      FROM gate_logs 
      WHERE timestamp >= today_start
    ),
    updated_at = NOW()
  WHERE id = 'current';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update metrics on new gate log
CREATE TRIGGER update_metrics_on_gate_log
  AFTER INSERT ON gate_logs
  FOR EACH ROW EXECUTE FUNCTION update_dashboard_metrics();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'guard'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- VIEWS
-- =====================================================

-- View for weekly trend data
CREATE OR REPLACE VIEW weekly_trend_data AS
SELECT 
  DATE_TRUNC('day', timestamp)::DATE as day,
  COUNT(*) FILTER (WHERE verdict = 'APPROVED') as approved,
  COUNT(*) FILTER (WHERE verdict = 'BLOCKED') as blocked
FROM gate_logs
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', timestamp)
ORDER BY day DESC;

-- View for recent gate events (live feed)
CREATE OR REPLACE VIEW recent_gate_events AS
SELECT 
  id,
  vehicle_no,
  verdict,
  timestamp,
  eway_bill_no,
  compliance_score
FROM gate_logs
ORDER BY timestamp DESC
LIMIT 20;
