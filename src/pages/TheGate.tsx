import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScanForm } from "@/components/gate/ScanForm";
import { ScanAnimation } from "@/components/gate/ScanAnimation";
import { VerdictDisplay } from "@/components/gate/VerdictDisplay";
import { GatePassModal } from "@/components/gate/GatePassModal";
import { verifyDispatch, type VerificationResult } from "@/services/verificationEngine";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type GateState = 'input' | 'scanning' | 'verdict';

interface ScanData {
  vehicleNo: string;
  eWayBill: string;
  outcome: 'approved' | 'blocked';
  checks: { name: string; status: 'passed' | 'failed' | 'warning'; details: string }[];
  errors?: string[];
  complianceScore: number;
  qrCodeHash: string | null;
  scanDuration: number;
}

export default function TheGate() {
  const { user } = useAuth();
  const [state, setState] = useState<GateState>('input');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [showGatePass, setShowGatePass] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleScan = async (vehicleNo: string, eWayBill: string) => {
    setState('scanning');

    try {
      // Call the verification engine
      const result = await verifyDispatch({
        vehicleNo,
        ewayBillNo: eWayBill,
        operatorId: user?.id,
      });

      setVerificationResult(result);

      // Transform result for the UI
      setScanData({
        vehicleNo,
        eWayBill,
        outcome: result.verdict === 'APPROVED' ? 'approved' : 'blocked',
        checks: result.checks.map(c => ({
          name: c.name,
          status: c.status,
          details: c.details,
        })),
        errors: result.reasons.length > 0 ? result.reasons : undefined,
        complianceScore: result.compliance_score,
        qrCodeHash: result.qr_code_hash,
        scanDuration: result.scan_duration_ms,
      });
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Verification system error. Please try again.');
      setState('input');
    }
  };

  const handleScanComplete = () => {
    setState('verdict');
    
    if (scanData?.outcome === 'approved') {
      toast.success('Compliance verification passed', {
        description: `Score: ${scanData.complianceScore}% | Duration: ${(scanData.scanDuration / 1000).toFixed(1)}s`,
      });
    } else {
      toast.error('Dispatch blocked due to compliance issues', {
        description: `${scanData?.errors?.length || 0} violation(s) detected`,
      });
    }
  };

  const handleIssuePass = () => {
    setShowGatePass(true);
    toast.success('Gate Pass Generated Successfully', {
      description: `Pass ID: ${verificationResult?.qr_code_hash?.slice(0, 16)}...`,
    });
  };

  const handleReset = () => {
    setState('input');
    setScanData(null);
    setVerificationResult(null);
    setShowGatePass(false);
  };

  return (
    <AppLayout>
      <div className="min-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">The Gate</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Compliance verification engine - Verify before dispatch
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center py-4 sm:py-8">
          <div className="w-full px-2 sm:px-0">
            {state === 'input' && (
              <ScanForm onSubmit={handleScan} isLoading={false} />
            )}

            {state === 'scanning' && (
              <ScanAnimation onComplete={handleScanComplete} />
            )}

            {state === 'verdict' && scanData && (
              <div className="space-y-4">
                <VerdictDisplay
                  outcome={scanData.outcome}
                  vehicleNo={scanData.vehicleNo}
                  eWayBill={scanData.eWayBill}
                  checks={scanData.checks}
                  errors={scanData.errors}
                  vehicle={verificationResult?.vehicle_snapshot}
                  driver={verificationResult?.driver_snapshot}
                  onIssuePass={scanData.outcome === 'approved' ? handleIssuePass : undefined}
                  onReset={handleReset}
                />
                
                {/* Additional Stats */}
                <div className="max-w-xl mx-auto">
                  <div className="bg-card rounded-lg border border-border p-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{scanData.complianceScore}%</p>
                      <p className="text-xs text-muted-foreground">Compliance Score</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{scanData.checks.length}</p>
                      <p className="text-xs text-muted-foreground">Checks Run</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{(scanData.scanDuration / 1000).toFixed(1)}s</p>
                      <p className="text-xs text-muted-foreground">Scan Duration</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gate Pass Modal */}
      {scanData && verificationResult && (
        <GatePassModal
          open={showGatePass}
          onOpenChange={setShowGatePass}
          vehicleNo={scanData.vehicleNo}
          eWayBill={scanData.eWayBill}
          driverName={verificationResult.driver_snapshot?.name}
          destination={undefined}
        />
      )}
    </AppLayout>
  );
}
