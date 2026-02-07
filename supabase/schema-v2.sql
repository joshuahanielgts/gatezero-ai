-- GateZero - Premium Schema V2
-- Run this AFTER schema.sql

-- =====================================================
-- ORGANIZATIONS (Multi-tenant support)
-- =====================================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add organization to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- =====================================================
-- ALERTS SYSTEM
-- =====================================================
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'resolved', 'dismissed');
CREATE TYPE alert_type AS ENUM (
  'rc_expiring', 'rc_expired',
  'insurance_expiring', 'insurance_expired',
  'permit_expiring', 'permit_expired',
  'license_expiring', 'license_expired',
  'blacklist_added', 'high_risk_vehicle',
  'compliance_drop', 'bulk_scan_failed',
  'api_quota_warning', 'system_alert'
);

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  type alert_type NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'medium',
  status alert_status NOT NULL DEFAULT 'active',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_type TEXT, -- 'vehicle', 'driver', 'trip', etc.
  entity_id TEXT,   -- vehicle_no, driver_id, etc.
  metadata JSONB DEFAULT '{}',
  acknowledged_by UUID REFERENCES profiles(id),
  acknowledged_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_org ON alerts(organization_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);

-- =====================================================
-- DOCUMENT VAULT
-- =====================================================
CREATE TYPE document_type AS ENUM (
  'rc_certificate', 'insurance_policy', 'permit',
  'fitness_certificate', 'puc_certificate', 'tax_receipt',
  'driving_license', 'aadhar_card', 'pan_card',
  'eway_bill', 'invoice', 'other'
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  document_type document_type NOT NULL,
  entity_type TEXT NOT NULL, -- 'vehicle' or 'driver'
  entity_id TEXT NOT NULL,   -- vehicle_no or driver_id
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  expiry_date DATE,
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_expiry ON documents(expiry_date);

-- =====================================================
-- COMPLIANCE SCORES HISTORY
-- =====================================================
CREATE TABLE IF NOT EXISTS compliance_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  factors JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_scores_entity ON compliance_scores(entity_type, entity_id);
CREATE INDEX idx_compliance_scores_date ON compliance_scores(recorded_at DESC);

-- =====================================================
-- API KEYS
-- =====================================================
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL, -- First 8 chars for display
  permissions JSONB DEFAULT '["read"]',
  rate_limit INTEGER DEFAULT 1000, -- requests per hour
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_org ON api_keys(organization_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

-- =====================================================
-- WEBHOOKS
-- =====================================================
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT,
  events TEXT[] NOT NULL, -- ['scan.completed', 'alert.created', etc.]
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BULK SCANS
-- =====================================================
CREATE TYPE bulk_scan_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS bulk_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT,
  status bulk_scan_status DEFAULT 'pending',
  total_count INTEGER NOT NULL,
  processed_count INTEGER DEFAULT 0,
  approved_count INTEGER DEFAULT 0,
  blocked_count INTEGER DEFAULT 0,
  warning_count INTEGER DEFAULT 0,
  items JSONB NOT NULL, -- Array of {vehicleNo, ewayBillNo}
  results JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- GEOFENCES
-- =====================================================
CREATE TABLE IF NOT EXISTS geofences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  fence_type TEXT DEFAULT 'polygon' CHECK (fence_type IN ('polygon', 'circle')),
  coordinates JSONB NOT NULL, -- GeoJSON format
  radius_meters INTEGER, -- For circle type
  is_restricted BOOLEAN DEFAULT false, -- If true, alerts when vehicle enters
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;

-- =====================================================
-- PENALTY RECORDS
-- =====================================================
CREATE TABLE IF NOT EXISTS penalty_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  vehicle_no TEXT NOT NULL,
  violation_type TEXT NOT NULL,
  penalty_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'disputed', 'waived')),
  detected_at TIMESTAMPTZ NOT NULL,
  gate_log_id UUID REFERENCES gate_logs(id),
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS CACHE
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  metric_name TEXT NOT NULL,
  metric_date DATE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, metric_name, metric_date)
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to generate alerts for expiring documents
CREATE OR REPLACE FUNCTION check_expiring_documents()
RETURNS void AS $$
DECLARE
  v RECORD;
BEGIN
  -- Check RC expiring in 30 days
  FOR v IN 
    SELECT vehicle_no, rc_expiry 
    FROM vehicles 
    WHERE rc_expiry BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
  LOOP
    INSERT INTO alerts (type, severity, title, message, entity_type, entity_id)
    VALUES (
      'rc_expiring',
      CASE 
        WHEN v.rc_expiry <= CURRENT_DATE + INTERVAL '7 days' THEN 'high'
        ELSE 'medium'
      END,
      'RC Expiring Soon',
      'Vehicle ' || v.vehicle_no || ' RC expires on ' || v.rc_expiry,
      'vehicle',
      v.vehicle_no
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
  
  -- Check Insurance expiring in 30 days
  FOR v IN 
    SELECT vehicle_no, insurance_expiry 
    FROM vehicles 
    WHERE insurance_expiry BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
  LOOP
    INSERT INTO alerts (type, severity, title, message, entity_type, entity_id)
    VALUES (
      'insurance_expiring',
      CASE 
        WHEN v.insurance_expiry <= CURRENT_DATE + INTERVAL '7 days' THEN 'high'
        ELSE 'medium'
      END,
      'Insurance Expiring Soon',
      'Vehicle ' || v.vehicle_no || ' insurance expires on ' || v.insurance_expiry,
      'vehicle',
      v.vehicle_no
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate organization stats
CREATE OR REPLACE FUNCTION get_org_stats(org_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_vehicles', (SELECT COUNT(*) FROM vehicles),
    'total_drivers', (SELECT COUNT(*) FROM drivers),
    'total_scans_today', (SELECT COUNT(*) FROM gate_logs WHERE DATE(timestamp) = CURRENT_DATE),
    'active_alerts', (SELECT COUNT(*) FROM alerts WHERE status = 'active'),
    'compliance_rate', (
      SELECT ROUND(AVG(compliance_score)::numeric, 1)
      FROM gate_logs 
      WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Alerts policies
CREATE POLICY "Users can view alerts" ON alerts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update alerts" ON alerts
  FOR UPDATE TO authenticated USING (true);

-- Documents policies
CREATE POLICY "Users can view documents" ON documents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert documents" ON documents
  FOR INSERT TO authenticated WITH CHECK (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- =====================================================
-- SEED SAMPLE ALERTS
-- =====================================================
INSERT INTO alerts (type, severity, title, message, entity_type, entity_id) VALUES
('rc_expiring', 'high', 'RC Expiring in 5 Days', 'Vehicle KA-01-MN-7890 RC expires on 2026-02-12', 'vehicle', 'KA-01-MN-7890'),
('insurance_expiring', 'medium', 'Insurance Expiring Soon', 'Vehicle TN-01-AB-1234 insurance expires on 2026-03-15', 'vehicle', 'TN-01-AB-1234'),
('high_risk_vehicle', 'high', 'High Risk Vehicle Detected', 'Vehicle MH-12-CD-9012 has risk score above 70', 'vehicle', 'MH-12-CD-9012'),
('license_expiring', 'medium', 'Driver License Expiring', 'Driver Suresh Kumar license expires in 30 days', 'driver', 'DL-0520200012346'),
('compliance_drop', 'low', 'Fleet Compliance Drop', 'Overall fleet compliance dropped by 5% this week', 'fleet', 'all');
