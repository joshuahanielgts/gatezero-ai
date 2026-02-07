// GateZero - Tools Page
// Penalty Calculator and other utility tools

import { Scale, FileSpreadsheet, Wrench } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenaltyCalculator } from '@/components/tools/PenaltyCalculator';
import { BulkScanner } from '@/components/gate/BulkScanner';
import { AppLayout } from '@/components/layout/AppLayout';
import { toast } from 'sonner';

interface PenaltyReceipt {
  vehicleNumber: string;
  driverName: string;
  totalFine: number;
  generatedAt: string;
}

interface ScanResult {
  vehicleNumber: string;
  result?: {
    compliance?: string;
    score?: number;
  };
}

export default function ToolsPage() {
  const handleGenerateReceipt = (data: PenaltyReceipt) => {
    console.log('Receipt generated:', data);
    toast.success('Receipt Generated', {
      description: `Fine of ₹${data.totalFine.toLocaleString('en-IN')} for ${data.vehicleNumber}`,
    });
  };

  const handleScanComplete = (results: ScanResult[]) => {
    console.log('Scan complete:', results);
    const compliant = results.filter(r => r.result?.compliance === 'compliant').length;
    toast.success('Bulk Scan Complete', {
      description: `${compliant}/${results.length} vehicles compliant`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Tools</h1>
          <p className="text-sm text-muted-foreground">Compliance utilities and calculators</p>
        </div>
      </div>

      {/* Tools Tabs */}
      <Tabs defaultValue="penalty" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="penalty" className="gap-2">
            <Scale className="w-4 h-4" />
            Penalty Calculator
          </TabsTrigger>
          <TabsTrigger value="bulk" className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Bulk Scanner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="penalty">
          <PenaltyCalculator onGenerateReceipt={handleGenerateReceipt} />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkScanner onScanComplete={handleScanComplete} />
        </TabsContent>
      </Tabs>
      </div>
    </AppLayout>
  );
}
