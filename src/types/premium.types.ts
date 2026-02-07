// GateZero - Premium Types
// Extended types for premium features

import type { VerdictType } from './database.types';

// =====================================================
// ORGANIZATIONS
// =====================================================
export type PlanType = 'free' | 'starter' | 'professional' | 'enterprise';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  plan: PlanType;
  settings: OrganizationSettings;
  created_at: string;
  updated_at: string;
}

export interface OrganizationSettings {
  timezone?: string;
  currency?: string;
  date_format?: string;
  notifications_enabled?: boolean;
  auto_alerts?: boolean;
  default_risk_threshold?: number;
}

// =====================================================
// ALERTS
// =====================================================
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';
export type AlertType = 
  | 'rc_expiring' | 'rc_expired'
  | 'insurance_expiring' | 'insurance_expired'
  | 'permit_expiring' | 'permit_expired'
  | 'license_expiring' | 'license_expired'
  | 'blacklist_added' | 'high_risk_vehicle'
  | 'compliance_drop' | 'bulk_scan_failed'
  | 'api_quota_warning' | 'system_alert'
  | 'document_expiry' | 'compliance_violation'
  | 'driver_violation' | 'geofence_breach';

export interface Alert {
  id: string;
  organization_id: string | null;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

// =====================================================
// DOCUMENTS
// =====================================================
export type DocumentType = 
  | 'rc_certificate' | 'insurance_policy' | 'permit'
  | 'fitness_certificate' | 'puc_certificate' | 'tax_receipt'
  | 'driving_license' | 'aadhar_card' | 'pan_card'
  | 'eway_bill' | 'invoice' | 'other';

export interface Document {
  id: string;
  organization_id: string | null;
  document_type: DocumentType;
  entity_type: 'vehicle' | 'driver';
  entity_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  expiry_date: string | null;
  verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// =====================================================
// API KEYS
// =====================================================
export interface ApiKey {
  id: string;
  organization_id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  rate_limit: number;
  last_used_at: string | null;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  revoked_at: string | null;
}

// =====================================================
// WEBHOOKS
// =====================================================
export interface Webhook {
  id: string;
  organization_id: string;
  name: string;
  url: string;
  secret: string | null;
  events: string[];
  is_active: boolean;
  last_triggered_at: string | null;
  failure_count: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// BULK SCANS
// =====================================================
export type BulkScanStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface BulkScanItem {
  vehicleNo: string;
  ewayBillNo: string;
}

export interface BulkScanResult {
  vehicleNo: string;
  ewayBillNo: string;
  verdict: VerdictType;
  complianceScore: number;
  errors?: string[];
}

export interface BulkScan {
  id: string;
  organization_id: string | null;
  name: string | null;
  status: BulkScanStatus;
  total_count: number;
  processed_count: number;
  approved_count: number;
  blocked_count: number;
  warning_count: number;
  items: BulkScanItem[];
  results: BulkScanResult[];
  started_at: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
}

// =====================================================
// NOTIFICATIONS
// =====================================================
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link: string | null;
  read_at: string | null;
  created_at: string;
}

// =====================================================
// PENALTY RECORDS
// =====================================================
export type PenaltyStatus = 'pending' | 'paid' | 'disputed' | 'waived';

export interface PenaltyRecord {
  id: string;
  organization_id: string | null;
  vehicle_no: string;
  violation_type: string;
  penalty_amount: number;
  status: PenaltyStatus;
  detected_at: string;
  gate_log_id: string | null;
  notes: string | null;
  paid_at: string | null;
  created_at: string;
}

// =====================================================
// ANALYTICS
// =====================================================
export interface AnalyticsMetric {
  name: string;
  value: number;
  change: number; // percentage change
  trend: 'up' | 'down' | 'stable';
}

export interface PredictiveInsight {
  type: 'risk' | 'compliance' | 'cost' | 'efficiency';
  title: string;
  prediction: string;
  confidence: number;
  recommendations: string[];
}

export interface FleetHealthScore {
  overall: number;
  categories: {
    documentation: number;
    maintenance: number;
    compliance: number;
    drivers: number;
  };
}

// =====================================================
// PENALTY CALCULATOR
// =====================================================
export interface ViolationInfo {
  id: string;
  name: string;
  category: string;
  base_penalty: number;
  max_penalty: number;
  description: string;
  section: string; // MV Act section
}

// Map for easy lookup by id
export const VIOLATION_TYPES_MAP: Record<string, ViolationInfo> = {
  expired_rc: {
    id: 'expired_rc',
    name: 'Expired Registration Certificate',
    category: 'Documentation',
    base_penalty: 5000,
    max_penalty: 10000,
    description: 'Operating vehicle with expired RC',
    section: 'Section 39'
  },
  expired_insurance: {
    id: 'expired_insurance',
    name: 'Expired Insurance',
    category: 'Documentation',
    base_penalty: 2000,
    max_penalty: 4000,
    description: 'Operating vehicle without valid insurance',
    section: 'Section 196'
  },
  expired_permit: {
    id: 'expired_permit',
    name: 'Expired Permit',
    category: 'Documentation',
    base_penalty: 10000,
    max_penalty: 10000,
    description: 'Operating commercial vehicle without valid permit',
    section: 'Section 192A'
  },
  expired_fitness: {
    id: 'expired_fitness',
    name: 'Expired Fitness Certificate',
    category: 'Documentation',
    base_penalty: 5000,
    max_penalty: 10000,
    description: 'Operating vehicle without valid fitness certificate',
    section: 'Section 56'
  },
  expired_puc: {
    id: 'expired_puc',
    name: 'Expired PUC Certificate',
    category: 'Environment',
    base_penalty: 1000,
    max_penalty: 2000,
    description: 'Operating vehicle without valid PUC',
    section: 'Section 190(2)'
  },
  overloading: {
    id: 'overloading',
    name: 'Overloading',
    category: 'Safety',
    base_penalty: 20000,
    max_penalty: 40000,
    description: 'Carrying excess load beyond permitted limit',
    section: 'Section 194(1)'
  },
  expired_license: {
    id: 'expired_license',
    name: 'Expired Driving License',
    category: 'Driver',
    base_penalty: 5000,
    max_penalty: 10000,
    description: 'Driving with expired license',
    section: 'Section 181'
  },
  no_eway_bill: {
    id: 'no_eway_bill',
    name: 'Missing E-Way Bill',
    category: 'GST',
    base_penalty: 10000,
    max_penalty: 25000,
    description: 'Transporting goods without valid E-Way Bill',
    section: 'GST Act Section 129'
  },
  invalid_eway_bill: {
    id: 'invalid_eway_bill',
    name: 'Invalid E-Way Bill',
    category: 'GST',
    base_penalty: 10000,
    max_penalty: 25000,
    description: 'E-Way Bill details mismatch',
    section: 'GST Act Section 129'
  },
  blacklisted_vehicle: {
    id: 'blacklisted_vehicle',
    name: 'Blacklisted Vehicle',
    category: 'Compliance',
    base_penalty: 25000,
    max_penalty: 50000,
    description: 'Operating a blacklisted/seized vehicle',
    section: 'Section 207'
  }
};

// Array for iterating (for backward compatibility)
export const VIOLATION_TYPES: ViolationInfo[] = Object.values(VIOLATION_TYPES_MAP);

// Type for violation id
export type ViolationTypeId = keyof typeof VIOLATION_TYPES_MAP;
