import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScanForm } from "@/components/gate/ScanForm";
import { ScanAnimation } from "@/components/gate/ScanAnimation";
import { VerdictDisplay } from "@/components/gate/VerdictDisplay";
import { GatePassModal } from "@/components/gate/GatePassModal";
import { vehicles, auditLogs } from "@/data/mockData";
import { toast } from "sonner";

type GateState = 'input' | 'scanning' | 'verdict';

export default function TheGate() {
  const [state, setState] = useState<GateState>('input');
  const [scanData, setScanData] = useState<{
    vehicleNo: string;
    eWayBill: string;
    outcome: 'approved' | 'blocked';
    checks: { name: string; status: 'passed' | 'failed' | 'warning'; details: string }[];
    errors?: string[];
  } | null>(null);
  const [showGatePass, setShowGatePass] = useState(false);

  const handleScan = (vehicleNo: string, eWayBill: string) => {
    setState('scanning');
    
    // Find vehicle data
    const vehicle = vehicles.find(v => v.regNo === vehicleNo);
    const isBlacklisted = vehicle?.isBlacklisted;
    const isInsuranceExpired = vehicle?.insuranceStatus === 'Expired';
    
    // Determine outcome based on mock data
    const shouldBlock = isBlacklisted || isInsuranceExpired || vehicleNo === 'MH-12-CD-9012';
    
    // Generate checks based on vehicle data
    const checks = [];
    const errors = [];

    if (isBlacklisted) {
      checks.push({ name: 'Blacklist Check', status: 'failed' as const, details: 'Vehicle is blacklisted' });
      errors.push(`Vehicle ${vehicleNo} is on the blacklist`);
    } else {
      checks.push({ name: 'Vahan API Verification', status: 'passed' as const, details: 'RC Status: Active' });
    }

    if (isInsuranceExpired) {
      checks.push({ name: 'Insurance Verification', status: 'failed' as const, details: 'Policy Expired' });
      errors.push('Insurance has expired');
    } else if (vehicle?.insuranceStatus === 'Expiring Soon') {
      checks.push({ name: 'Insurance Verification', status: 'warning' as const, details: 'Policy Expiring Soon' });
    } else {
      checks.push({ name: 'Insurance Verification', status: 'passed' as const, details: 'Policy Active' });
    }

    if (!shouldBlock) {
      checks.push({ name: 'GSTIN Validation', status: 'passed' as const, details: 'GSTIN Active' });
      checks.push({ name: 'E-Way Bill Validation', status: 'passed' as const, details: 'E-Way Bill Valid' });
      checks.push({ name: 'Route Distance Check', status: 'passed' as const, details: 'PIN Code Gap: 3.2%' });
    }

    setScanData({
      vehicleNo,
      eWayBill,
      outcome: shouldBlock ? 'blocked' : 'approved',
      checks,
      errors: errors.length > 0 ? errors : undefined,
    });
  };

  const handleScanComplete = () => {
    setState('verdict');
    if (scanData?.outcome === 'approved') {
      toast.success('Compliance verification passed');
    } else {
      toast.error('Dispatch blocked due to compliance issues');
    }
  };

  const handleIssuePass = () => {
    setShowGatePass(true);
    toast.success('Gate Pass Generated Successfully');
  };

  const handleReset = () => {
    setState('input');
    setScanData(null);
    setShowGatePass(false);
  };

  return (
    <AppLayout>
      <div className="min-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">The Gate</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Compliance verification engine - Verify before dispatch
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full">
            {state === 'input' && (
              <ScanForm onSubmit={handleScan} isLoading={false} />
            )}

            {state === 'scanning' && (
              <ScanAnimation onComplete={handleScanComplete} />
            )}

            {state === 'verdict' && scanData && (
              <VerdictDisplay
                outcome={scanData.outcome}
                vehicleNo={scanData.vehicleNo}
                eWayBill={scanData.eWayBill}
                checks={scanData.checks}
                errors={scanData.errors}
                onIssuePass={scanData.outcome === 'approved' ? handleIssuePass : undefined}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </div>

      {/* Gate Pass Modal */}
      {scanData && (
        <GatePassModal
          open={showGatePass}
          onOpenChange={setShowGatePass}
          vehicleNo={scanData.vehicleNo}
          eWayBill={scanData.eWayBill}
        />
      )}
    </AppLayout>
  );
}
