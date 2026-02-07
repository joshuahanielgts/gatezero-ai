// GateZero - Gemini AI Service
// Provides AI-powered insights for compliance verification

import type { Vehicle, Driver, VerificationCheck, VerdictType } from '@/types/database.types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface BillInsights {
  summary: string;
  riskFactors: string[];
  recommendations: string[];
  complianceNotes: string[];
  estimatedRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface VehicleInsights {
  healthScore: number;
  maintenanceAlerts: string[];
  complianceSuggestions: string[];
  historicalPattern: string;
}

export interface VerificationInsights {
  aiAnalysis: string;
  potentialIssues: string[];
  suggestedActions: string[];
  confidenceScore: number;
}

/**
 * Check if Gemini API is configured
 */
export const isGeminiConfigured = (): boolean => {
  return !!GEMINI_API_KEY && GEMINI_API_KEY !== 'your-gemini-api-key';
};

/**
 * Call Gemini API with a prompt
 */
const callGemini = async (prompt: string): Promise<string> => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API not configured');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini API request failed');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

/**
 * Parse JSON from Gemini response (handles markdown code blocks)
 */
const parseGeminiJSON = <T>(text: string): T => {
  // Remove markdown code blocks if present
  let cleanText = text.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.slice(7);
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.slice(3);
  }
  if (cleanText.endsWith('```')) {
    cleanText = cleanText.slice(0, -3);
  }
  return JSON.parse(cleanText.trim());
};

/**
 * Generate E-Way Bill insights using Gemini AI
 */
export const generateBillInsights = async (
  ewayBillNo: string,
  vehicle: Partial<Vehicle> | null,
  driver: Partial<Driver> | null,
  checks: VerificationCheck[]
): Promise<BillInsights> => {
  const prompt = `You are a logistics compliance expert AI. Analyze this E-Way Bill verification data and provide insights.

E-Way Bill Number: ${ewayBillNo}

Vehicle Information:
${vehicle ? `
- Vehicle No: ${vehicle.vehicle_no}
- Type: ${vehicle.vehicle_type}
- Owner: ${vehicle.owner_name}
- RC Status: ${vehicle.rc_status}
- RC Expiry: ${vehicle.rc_expiry}
- Insurance Expiry: ${vehicle.insurance_expiry}
- Permit Expiry: ${vehicle.permit_expiry || 'N/A'}
- GSTIN: ${vehicle.gstin || 'N/A'}
- Blacklisted: ${vehicle.is_blacklisted ? 'YES - ' + vehicle.blacklist_reason : 'No'}
- Risk Score: ${vehicle.risk_score}/100
` : 'Vehicle not found in registry'}

Driver Information:
${driver ? `
- Name: ${driver.name}
- License No: ${driver.license_no}
- License Expiry: ${driver.license_expiry}
- Status: ${driver.status}
` : 'No driver assigned'}

Verification Checks:
${checks.map(c => `- ${c.name}: ${c.status.toUpperCase()} - ${c.details}`).join('\n')}

Respond ONLY with valid JSON in this exact format (no markdown, no explanation):
{
  "summary": "Brief 1-2 sentence summary of the verification",
  "riskFactors": ["List of identified risk factors, max 4 items"],
  "recommendations": ["Actionable recommendations for compliance, max 3 items"],
  "complianceNotes": ["Important compliance notes for the operator, max 3 items"],
  "estimatedRiskLevel": "LOW or MEDIUM or HIGH"
}`;

  try {
    const response = await callGemini(prompt);
    return parseGeminiJSON<BillInsights>(response);
  } catch (error) {
    console.error('Gemini Bill Insights Error:', error);
    // Return fallback insights
    const failedChecks = checks.filter(c => c.status === 'failed');
    const warningChecks = checks.filter(c => c.status === 'warning');
    
    return {
      summary: `Verification completed with ${failedChecks.length} failures and ${warningChecks.length} warnings.`,
      riskFactors: failedChecks.map(c => c.details),
      recommendations: failedChecks.length > 0 
        ? ['Address failed compliance checks before proceeding', 'Update expired documents']
        : ['Continue monitoring document expiry dates'],
      complianceNotes: warningChecks.map(c => c.details),
      estimatedRiskLevel: failedChecks.length > 0 ? 'HIGH' : warningChecks.length > 0 ? 'MEDIUM' : 'LOW',
    };
  }
};

/**
 * Generate vehicle fleet insights
 */
export const generateVehicleInsights = async (
  vehicle: Vehicle,
  recentScans: number,
  recentBlocks: number
): Promise<VehicleInsights> => {
  const prompt = `You are a fleet management AI. Analyze this vehicle's compliance data and provide insights.

Vehicle: ${vehicle.vehicle_no}
Type: ${vehicle.vehicle_type}
Owner: ${vehicle.owner_name}

Compliance Status:
- RC Status: ${vehicle.rc_status}, Expiry: ${vehicle.rc_expiry}
- Insurance Expiry: ${vehicle.insurance_expiry}
- Permit Expiry: ${vehicle.permit_expiry || 'N/A'}
- GSTIN: ${vehicle.gstin || 'Not registered'}
- Blacklisted: ${vehicle.is_blacklisted ? 'YES' : 'No'}
- Current Risk Score: ${vehicle.risk_score}/100

Recent Activity:
- Total scans (30 days): ${recentScans}
- Blocks (30 days): ${recentBlocks}

Respond ONLY with valid JSON in this exact format:
{
  "healthScore": <number 0-100>,
  "maintenanceAlerts": ["Urgent maintenance/compliance alerts, max 3"],
  "complianceSuggestions": ["Suggestions to improve compliance, max 3"],
  "historicalPattern": "Brief analysis of the vehicle's compliance pattern"
}`;

  try {
    const response = await callGemini(prompt);
    return parseGeminiJSON<VehicleInsights>(response);
  } catch (error) {
    console.error('Gemini Vehicle Insights Error:', error);
    return {
      healthScore: 100 - vehicle.risk_score,
      maintenanceAlerts: vehicle.is_blacklisted ? ['Vehicle is blacklisted'] : [],
      complianceSuggestions: ['Keep documents updated', 'Monitor expiry dates'],
      historicalPattern: 'Unable to analyze pattern at this time.',
    };
  }
};

/**
 * Generate real-time verification insights
 */
export const generateVerificationInsights = async (
  vehicleNo: string,
  ewayBillNo: string,
  verdict: VerdictType,
  checks: VerificationCheck[],
  complianceScore: number
): Promise<VerificationInsights> => {
  const prompt = `You are a gate security AI assistant. Provide quick insights for this vehicle verification.

Vehicle: ${vehicleNo}
E-Way Bill: ${ewayBillNo}
Verdict: ${verdict}
Compliance Score: ${complianceScore}%

Checks Performed:
${checks.map(c => `- ${c.name}: ${c.status} - ${c.details}`).join('\n')}

Respond ONLY with valid JSON:
{
  "aiAnalysis": "Brief 1-sentence analysis of this scan result",
  "potentialIssues": ["Any potential issues to watch for, max 2"],
  "suggestedActions": ["Recommended actions for gate operator, max 2"],
  "confidenceScore": <number 0-100 representing confidence in the verdict>
}`;

  try {
    const response = await callGemini(prompt);
    return parseGeminiJSON<VerificationInsights>(response);
  } catch (error) {
    console.error('Gemini Verification Insights Error:', error);
    return {
      aiAnalysis: `Vehicle ${verdict.toLowerCase()} with ${complianceScore}% compliance score.`,
      potentialIssues: checks.filter(c => c.status !== 'passed').map(c => c.name),
      suggestedActions: verdict === 'BLOCKED' ? ['Do not allow entry', 'Contact supervisor'] : ['Proceed with standard protocol'],
      confidenceScore: complianceScore,
    };
  }
};

/**
 * Generate daily operations summary
 */
export const generateDailySummary = async (
  totalScans: number,
  approved: number,
  blocked: number,
  warnings: number,
  topBlockReasons: string[]
): Promise<string> => {
  if (!isGeminiConfigured()) {
    return `Today: ${totalScans} scans (${approved} approved, ${blocked} blocked, ${warnings} warnings)`;
  }

  const prompt = `You are a logistics operations AI. Generate a brief daily summary.

Today's Statistics:
- Total Scans: ${totalScans}
- Approved: ${approved}
- Blocked: ${blocked}
- Warnings: ${warnings}
- Top Block Reasons: ${topBlockReasons.join(', ') || 'None'}

Generate a single paragraph (2-3 sentences) summarizing operations and any concerns. Be professional and concise.`;

  try {
    const response = await callGemini(prompt);
    return response.trim();
  } catch (error) {
    console.error('Gemini Daily Summary Error:', error);
    return `Today: ${totalScans} scans completed. ${approved} approved, ${blocked} blocked, ${warnings} warnings.`;
  }
};
