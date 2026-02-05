import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Scan } from "lucide-react";

interface ScanFormProps {
  onSubmit: (vehicleNo: string, eWayBill: string) => void;
  isLoading: boolean;
}

export function ScanForm({ onSubmit, isLoading }: ScanFormProps) {
  const [vehicleNo, setVehicleNo] = useState("");
  const [eWayBill, setEWayBill] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vehicleNo && eWayBill) {
      onSubmit(vehicleNo, eWayBill);
    }
  };

  // Demo auto-fill functions
  const fillApprovedDemo = () => {
    setVehicleNo("TN-01-AB-1234");
    setEWayBill("331000000001");
  };

  const fillBlockedDemo = () => {
    setVehicleNo("MH-12-CD-9012");
    setEWayBill("271000000002");
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Compliance Verification</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Enter vehicle and E-Way Bill details to initiate compliance scan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="vehicleNo" className="text-foreground">Vehicle Number</Label>
          <Input
            id="vehicleNo"
            type="text"
            placeholder="TN-01-AB-1234"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
            className="font-mono text-lg h-14 bg-background border-border focus:border-primary"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eWayBill" className="text-foreground">E-Way Bill Number</Label>
          <Input
            id="eWayBill"
            type="text"
            placeholder="331000000001"
            value={eWayBill}
            onChange={(e) => setEWayBill(e.target.value.replace(/\D/g, '').slice(0, 12))}
            className="font-mono text-lg h-14 bg-background border-border focus:border-primary"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">12-digit E-Way Bill number</p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={!vehicleNo || !eWayBill || isLoading}
        >
          <Scan className="w-5 h-5 mr-2" />
          INITIATE SCAN
        </Button>
      </form>

      {/* Demo buttons */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center mb-3">Demo Quick Fill</p>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 border-safe/30 text-safe hover:bg-safe/10"
            onClick={fillApprovedDemo}
            disabled={isLoading}
          >
            ✓ Approved Vehicle
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 border-blocked/30 text-blocked hover:bg-blocked/10"
            onClick={fillBlockedDemo}
            disabled={isLoading}
          >
            ✗ Blocked Vehicle
          </Button>
        </div>
      </div>
    </div>
  );
}
