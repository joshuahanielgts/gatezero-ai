import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, QrCode, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface GatePassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleNo: string;
  eWayBill: string;
  driverName?: string;
  destination?: string;
}

export function GatePassModal({
  open,
  onOpenChange,
  vehicleNo,
  eWayBill,
  driverName = "Ramesh Kumar",
  destination = "Bangalore",
}: GatePassModalProps) {
  const passNo = `GP-${Date.now().toString().slice(-8)}`;
  const timestamp = format(new Date(), "dd MMM yyyy, HH:mm:ss");

  const handlePrint = () => {
    window.print();
    toast.success("Gate Pass sent to printer");
  };

  const handleDownload = () => {
    // Simulate download
    toast.success("Gate Pass downloaded successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">Gate Pass Preview</DialogTitle>
        </DialogHeader>

        {/* Gate Pass Content */}
        <div className="bg-background border border-border rounded-lg p-6 relative overflow-hidden">
          {/* Cleared Stamp */}
          <div className="absolute top-4 right-4 rotate-12">
            <div className="border-4 border-safe rounded-lg px-4 py-2">
              <span className="text-safe font-bold text-xl tracking-wider">CLEARED</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-foreground">GateZero</h2>
            <p className="text-xs text-muted-foreground">Compliance Gate Pass</p>
          </div>

          {/* Pass Number */}
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground">Pass No.</p>
            <p className="font-mono text-lg font-bold text-primary">{passNo}</p>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
              <QrCode className="w-20 h-20 text-zinc-900" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vehicle No.</span>
              <span className="font-mono font-semibold text-foreground">{vehicleNo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">E-Way Bill</span>
              <span className="font-mono text-foreground">{eWayBill}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Driver</span>
              <span className="text-foreground">{driverName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Destination</span>
              <span className="text-foreground">{destination}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Issued At</span>
              <span className="text-foreground">{timestamp}</span>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-safe">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">All Compliance Checks Passed</span>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground">
              This is a digitally verified gate pass issued by GateZero
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button className="flex-1 bg-primary" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
