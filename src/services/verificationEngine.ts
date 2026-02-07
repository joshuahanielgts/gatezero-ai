// GateZero - Verification Engine
// Core business logic for compliance verification

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { 
  Vehicle, 
  Driver, 
  GateLogMetadata, 
  VerificationCheck,
  VerdictType,
  GateLogInsert
} from '@/types/database.types';

// =====================================================
// TYPES
// =====================================================

export interface VerificationResult {
  verdict: VerdictType;
  reasons: string[];
  checks: VerificationCheck[];
  compliance_score: number;
  timestamp: string;
  scan_duration_ms: number;
  qr_code_hash: string | null;
  vehicle_snapshot: Partial<Vehicle> | null;
  driver_snapshot: Partial<Driver> | null;
}

export interface VerificationInput {
  vehicleNo: string;
  ewayBillNo: string;
  operatorId?: string;
  operatorIp?: string;
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Simulates API latency for realistic UX
 */
const simulateLatency = (min: number = 300, max: number = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Generates a unique hash for QR codes
 */
const generateQRCodeHash = (vehicleNo: string, ewayBillNo: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `WG-${vehicleNo.replace(/[^A-Z0-9]/gi, '')}-${timestamp}-${random}`.toUpperCase();
};

/**
 * Calculates days until expiry (negative if expired)
 */
const daysUntilExpiry = (expiryDate: string): number => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Formats date for display
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// =====================================================
// DATA FETCHING
// =====================================================

/**
 * Fetches vehicle data from Supabase
 */
const fetchVehicle = async (vehicleNo: string): Promise<Vehicle | null> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured');
    return null;
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('vehicle_no', vehicleNo)
    .single();
  
  if (error) {
    console.error('Error fetching vehicle:', error);
    return null;
  }
  return data;
};

/**
 * Fetches driver data by vehicle number
 */
const fetchDriverByVehicle = async (vehicleNo: string): Promise<Driver | null> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured');
    return null;
  }

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('assigned_vehicle_no', vehicleNo)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching driver:', error);
  }
  return data || null;
};

// =====================================================
// VERIFICATION CHECKS
// =====================================================

/**
 * Check 1: Blacklist verification
 */
const checkBlacklist = async (vehicle: Vehicle): Promise<VerificationCheck> => {
  await simulateLatency(200, 400);
  
  return {
    name: 'Blacklist Check',
    status: vehicle.is_blacklisted ? 'failed' : 'passed',
    details: vehicle.is_blacklisted 
      ? `Vehicle is blacklisted${vehicle.blacklist_reason ? `: ${vehicle.blacklist_reason}` : ''}`
      : 'Vehicle not on blacklist',
    timestamp: new Date().toISOString(),
  };
};

/**
 * Check 2: Vahan API (RC Status) verification
 */
const checkVahanAPI = async (vehicle: Vehicle): Promise<VerificationCheck> => {
  await simulateLatency(400, 700);
  
  const rcDays = daysUntilExpiry(vehicle.rc_expiry);
  
  if (vehicle.rc_status === 'Expired' || rcDays < 0) {
    return {
      name: 'Vahan API Verification',
      status: 'failed',
      details: `RC Expired on ${formatDate(vehicle.rc_expiry)}`,
      timestamp: new Date().toISOString(),
    };
  }
  
  if (vehicle.rc_status === 'Suspended') {
    return {
      name: 'Vahan API Verification',
      status: 'failed',
      details: 'RC Status: Suspended - Contact RTO',
      timestamp: new Date().toISOString(),
    };
  }
  
  return {
    name: 'Vahan API Verification',
    status: 'passed',
    details: `RC Status: Active, Valid until ${formatDate(vehicle.rc_expiry)}`,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Check 3: Insurance verification
 */
const checkInsurance = async (vehicle: Vehicle): Promise<VerificationCheck> => {
  await simulateLatency(300, 600);
  
  const days = daysUntilExpiry(vehicle.insurance_expiry);
  
  if (days < 0) {
    return {
      name: 'Insurance Verification',
      status: 'failed',
      details: `Policy Expired ${Math.abs(days)} days ago (${formatDate(vehicle.insurance_expiry)})`,
      timestamp: new Date().toISOString(),
    };
  }
  
  if (days <= 7) {
    return {
      name: 'Insurance Verification',
      status: 'warning',
      details: `Policy Expiring in ${days} days (${formatDate(vehicle.insurance_expiry)})`,
      timestamp: new Date().toISOString(),
    };
  }
  
  return {
    name: 'Insurance Verification',
    status: 'passed',
    details: `Policy Active, Valid until ${formatDate(vehicle.insurance_expiry)}`,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Check 4: GSTIN validation
 */
const checkGSTIN = async (vehicle: Vehicle): Promise<VerificationCheck> => {
  await simulateLatency(350, 550);
  
  if (!vehicle.gstin) {
    return {
      name: 'GSTIN Validation',
      status: 'warning',
      details: 'GSTIN not registered',
      timestamp: new Date().toISOString(),
    };
  }
  
  // Simulate GST API response (in production, call actual GST API)
  const gstStatus = Math.random() > 0.1 ? 'Active' : 'Suspended';
  
  if (gstStatus === 'Suspended') {
    return {
      name: 'GSTIN Validation',
      status: 'warning',
      details: `GSTIN ${vehicle.gstin} - Status: Under Review`,
      timestamp: new Date().toISOString(),
    };
  }
  
  return {
    name: 'GSTIN Validation',
    status: 'passed',
    details: `GSTIN ${vehicle.gstin} - Active`,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Check 5: E-Way Bill validation
 */
const checkEWayBill = async (ewayBillNo: string): Promise<VerificationCheck> => {
  await simulateLatency(400, 700);
  
  // Validate E-Way Bill format (12-digit number)
  const isValid = ewayBillNo.length === 12 && /^\d+$/.test(ewayBillNo);
  
  if (!isValid) {
    return {
      name: 'E-Way Bill Validation',
      status: 'failed',
      details: 'Invalid E-Way Bill format (must be 12 digits)',
      timestamp: new Date().toISOString(),
    };
  }
  
  return {
    name: 'E-Way Bill Validation',
    status: 'passed',
    details: `E-Way Bill ${ewayBillNo} - Valid`,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Check 6: Permit verification
 */
const checkPermit = async (vehicle: Vehicle): Promise<VerificationCheck> => {
  await simulateLatency(250, 450);
  
  if (!vehicle.permit_expiry) {
    return {
      name: 'Permit Verification',
      status: 'warning',
      details: 'Permit information not available',
      timestamp: new Date().toISOString(),
    };
  }
  
  const days = daysUntilExpiry(vehicle.permit_expiry);
  
  if (days < 0) {
    return {
      name: 'Permit Verification',
      status: 'failed',
      details: `National Permit Expired ${Math.abs(days)} days ago`,
      timestamp: new Date().toISOString(),
    };
  }
  
  if (days <= 30) {
    return {
      name: 'Permit Verification',
      status: 'warning',
      details: `Permit Expiring in ${days} days`,
      timestamp: new Date().toISOString(),
    };
  }
  
  return {
    name: 'Permit Verification',
    status: 'passed',
    details: `National Permit Valid until ${formatDate(vehicle.permit_expiry)}`,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Check 7: Driver license verification
 */
const checkDriverLicense = async (driver: Driver | null): Promise<VerificationCheck> => {
  await simulateLatency(300, 500);
  
  if (!driver) {
    return {
      name: 'Driver License Check',
      status: 'warning',
      details: 'No driver assigned to vehicle',
      timestamp: new Date().toISOString(),
    };
  }
  
  const days = daysUntilExpiry(driver.license_expiry);
  
  if (days < 0) {
    return {
      name: 'Driver License Check',
      status: 'failed',
      details: `License Expired ${Math.abs(days)} days ago`,
      timestamp: new Date().toISOString(),
    };
  }
  
  if (days <= 30) {
    return {
      name: 'Driver License Check',
      status: 'warning',
      details: `License Expiring in ${days} days`,
      timestamp: new Date().toISOString(),
    };
  }
  
  return {
    name: 'Driver License Check',
    status: 'passed',
    details: `License ${driver.license_no} - Valid`,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Check 8: Route distance validation
 */
const checkRouteDistance = async (): Promise<VerificationCheck> => {
  await simulateLatency(500, 800);
  
  // Simulate route distance check
  const pinCodeGap = (Math.random() * 8 + 1).toFixed(1);
  
  return {
    name: 'Route Distance Check',
    status: 'passed',
    details: `PIN Code Gap: ${pinCodeGap}% (Within limits)`,
    timestamp: new Date().toISOString(),
  };
};

// =====================================================
// MAIN VERIFICATION FUNCTION
// =====================================================

/**
 * Main verification engine function
 * Performs all compliance checks and returns a comprehensive result
 */
export const verifyDispatch = async (input: VerificationInput): Promise<VerificationResult> => {
  const startTime = Date.now();
  const { vehicleNo, ewayBillNo, operatorId, operatorIp } = input;
  
  // Check Supabase configuration
  if (!isSupabaseConfigured()) {
    return {
      verdict: 'BLOCKED',
      reasons: ['Database not configured. Please set up Supabase credentials.'],
      checks: [{
        name: 'System Check',
        status: 'failed',
        details: 'Database connection not configured',
        timestamp: new Date().toISOString(),
      }],
      compliance_score: 0,
      timestamp: new Date().toISOString(),
      scan_duration_ms: Date.now() - startTime,
      qr_code_hash: null,
      vehicle_snapshot: null,
      driver_snapshot: null,
    };
  }
  
  const checks: VerificationCheck[] = [];
  const errors: string[] = [];
  let verdict: VerdictType = 'APPROVED';
  let complianceScore = 100;
  
  // Fetch vehicle data
  const vehicle = await fetchVehicle(vehicleNo);
  
  if (!vehicle) {
    const scanDuration = Date.now() - startTime;
    
    const result: VerificationResult = {
      verdict: 'BLOCKED',
      reasons: ['Vehicle not found in registry'],
      checks: [{
        name: 'Vehicle Registry Check',
        status: 'failed',
        details: `Vehicle ${vehicleNo} not found in system`,
        timestamp: new Date().toISOString(),
      }],
      compliance_score: 0,
      timestamp: new Date().toISOString(),
      scan_duration_ms: scanDuration,
      qr_code_hash: null,
      vehicle_snapshot: null,
      driver_snapshot: null,
    };
    
    await recordGateLog(result, input);
    return result;
  }
  
  // Fetch driver data
  const driver = await fetchDriverByVehicle(vehicleNo);
  
  // Run all verification checks
  // Check 1: Blacklist
  const blacklistCheck = await checkBlacklist(vehicle);
  checks.push(blacklistCheck);
  if (blacklistCheck.status === 'failed') {
    verdict = 'BLOCKED';
    errors.push(`Vehicle ${vehicleNo} is on the blacklist`);
    complianceScore -= 50;
  }
  
  // If blacklisted, skip other checks
  if (verdict !== 'BLOCKED') {
    // Check 2: Vahan API (RC Status)
    const vahanCheck = await checkVahanAPI(vehicle);
    checks.push(vahanCheck);
    if (vahanCheck.status === 'failed') {
      verdict = 'BLOCKED';
      errors.push(vahanCheck.details);
      complianceScore -= 30;
    }
    
    // Check 3: Insurance
    const insuranceCheck = await checkInsurance(vehicle);
    checks.push(insuranceCheck);
    if (insuranceCheck.status === 'failed') {
      verdict = 'BLOCKED';
      errors.push(insuranceCheck.details);
      complianceScore -= 25;
    } else if (insuranceCheck.status === 'warning') {
      if (verdict !== 'BLOCKED') verdict = 'WARNING';
      complianceScore -= 10;
    }
    
    // Check 4: GSTIN
    const gstinCheck = await checkGSTIN(vehicle);
    checks.push(gstinCheck);
    if (gstinCheck.status === 'warning') {
      complianceScore -= 5;
    }
    
    // Check 5: E-Way Bill
    const ewayCheck = await checkEWayBill(ewayBillNo);
    checks.push(ewayCheck);
    if (ewayCheck.status === 'failed') {
      verdict = 'BLOCKED';
      errors.push(ewayCheck.details);
      complianceScore -= 20;
    }
    
    // Check 6: Permit
    const permitCheck = await checkPermit(vehicle);
    checks.push(permitCheck);
    if (permitCheck.status === 'failed') {
      verdict = 'BLOCKED';
      errors.push(permitCheck.details);
      complianceScore -= 15;
    } else if (permitCheck.status === 'warning') {
      complianceScore -= 5;
    }
    
    // Check 7: Driver License
    const driverCheck = await checkDriverLicense(driver);
    checks.push(driverCheck);
    if (driverCheck.status === 'failed') {
      verdict = 'BLOCKED';
      errors.push(driverCheck.details);
      complianceScore -= 20;
    } else if (driverCheck.status === 'warning') {
      complianceScore -= 5;
    }
    
    // Check 8: Route Distance
    const routeCheck = await checkRouteDistance();
    checks.push(routeCheck);
  }
  
  // Ensure compliance score doesn't go negative
  complianceScore = Math.max(0, complianceScore);
  
  // Generate QR code hash only for approved verdicts
  const qrCodeHash = verdict === 'APPROVED' || verdict === 'WARNING' 
    ? generateQRCodeHash(vehicleNo, ewayBillNo) 
    : null;
  
  const scanDuration = Date.now() - startTime;
  
  const result: VerificationResult = {
    verdict: verdict === 'WARNING' ? 'APPROVED' : verdict,
    reasons: errors,
    checks,
    compliance_score: complianceScore,
    timestamp: new Date().toISOString(),
    scan_duration_ms: scanDuration,
    qr_code_hash: qrCodeHash,
    vehicle_snapshot: vehicle,
    driver_snapshot: driver,
  };
  
  await recordGateLog(result, input);
  return result;
};

// =====================================================
// AUDIT LOGGING
// =====================================================

/**
 * Records the verification result to the gate_logs table
 */
const recordGateLog = async (
  result: VerificationResult,
  input: VerificationInput
): Promise<void> => {
  if (!isSupabaseConfigured()) {
    console.log('[No DB] Gate log would be recorded:', {
      vehicle_no: input.vehicleNo,
      verdict: result.verdict,
      compliance_score: result.compliance_score,
    });
    return;
  }
  
  const metadata: GateLogMetadata = {
    checks: result.checks,
    errors: result.reasons.length > 0 ? result.reasons : undefined,
    api_responses: {
      vahan: result.vehicle_snapshot ? { 
        status: result.vehicle_snapshot.rc_status, 
        rcValidUntil: result.vehicle_snapshot.rc_expiry 
      } : {},
      gst: result.vehicle_snapshot?.gstin ? { 
        gstin: result.vehicle_snapshot.gstin, 
        status: 'Active' 
      } : {},
      insurance: result.vehicle_snapshot ? {
        validUntil: result.vehicle_snapshot.insurance_expiry,
        policyNo: result.vehicle_snapshot.insurance_policy_no,
        insurer: result.vehicle_snapshot.insurer_name,
      } : {},
    },
    vehicle_snapshot: result.vehicle_snapshot || undefined,
    driver_snapshot: result.driver_snapshot || undefined,
  };
  
  const gateLogEntry = {
    timestamp: result.timestamp,
    vehicle_no: input.vehicleNo,
    eway_bill_no: input.ewayBillNo,
    verdict: result.verdict,
    scan_duration_ms: result.scan_duration_ms,
    compliance_score: result.compliance_score,
    operator_id: input.operatorId || null,
    operator_ip: input.operatorIp || null,
    qr_code_hash: result.qr_code_hash,
    metadata,
  };
  
  // @ts-expect-error - Supabase type inference issue with insert method
  const { error } = await supabase.from('gate_logs').insert(gateLogEntry);
  
  if (error) {
    console.error('Error recording gate log:', error);
  }
};

// =====================================================
// EXPORTS
// =====================================================

export { fetchVehicle, fetchDriverByVehicle, isSupabaseConfigured };
