// GateZero - Bulk Scanner Component
// Process multiple vehicles efficiently for checkpoints and fleet verification

import { useState, useCallback } from 'react';
import { 
  Upload, FileSpreadsheet, Play, Pause, CheckCircle2, XCircle,
  AlertTriangle, Loader2, Download, Trash2, Plus, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { BulkScan } from '@/types/premium.types';

interface BulkScanItem {
  id: string;
  vehicleNumber: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    compliance: 'compliant' | 'non-compliant' | 'warning';
    score?: number;
    issues: string[];
  };
  processedAt?: string;
}

interface BulkScannerProps {
  onScanComplete?: (results: BulkScanItem[]) => void;
  onSaveResults?: (scan: Partial<BulkScan>) => void;
}

export function BulkScanner({ onScanComplete, onSaveResults }: BulkScannerProps) {
  const [items, setItems] = useState<BulkScanItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [singleInput, setSingleInput] = useState('');

  const processedCount = items.filter(i => i.status === 'completed' || i.status === 'failed').length;
  const compliantCount = items.filter(i => i.result?.compliance === 'compliant').length;
  const nonCompliantCount = items.filter(i => i.result?.compliance === 'non-compliant').length;
  const warningCount = items.filter(i => i.result?.compliance === 'warning').length;

  const progress = items.length > 0 ? (processedCount / items.length) * 100 : 0;

  const parseVehicleNumbers = (text: string): string[] => {
    // Split by newlines, commas, or spaces and clean up
    return text
      .split(/[\n,\s]+/)
      .map(v => v.trim().toUpperCase())
      .filter(v => v.length >= 6) // Basic validation
      .filter((v, i, arr) => arr.indexOf(v) === i); // Remove duplicates
  };

  const addFromBulkInput = () => {
    const numbers = parseVehicleNumbers(bulkInput);
    const existingNumbers = new Set(items.map(i => i.vehicleNumber));
    
    const newItems: BulkScanItem[] = numbers
      .filter(num => !existingNumbers.has(num))
      .map(num => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        vehicleNumber: num,
        status: 'pending' as const,
      }));

    setItems(prev => [...prev, ...newItems]);
    setBulkInput('');
  };

  const addSingleVehicle = () => {
    const num = singleInput.trim().toUpperCase();
    if (num.length < 6) return;
    if (items.some(i => i.vehicleNumber === num)) return;

    setItems(prev => [...prev, {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      vehicleNumber: num,
      status: 'pending',
    }]);
    setSingleInput('');
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearAll = () => {
    setItems([]);
    setIsProcessing(false);
    setIsPaused(false);
  };

  // Simulate verification process
  const simulateVerification = useCallback(async (item: BulkScanItem): Promise<BulkScanItem> => {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simulate random results
    const random = Math.random();
    let compliance: 'compliant' | 'non-compliant' | 'warning';
    let issues: string[] = [];
    let score = 0;

    if (random > 0.7) {
      compliance = 'compliant';
      score = 85 + Math.floor(Math.random() * 15);
      issues = [];
    } else if (random > 0.3) {
      compliance = 'warning';
      score = 60 + Math.floor(Math.random() * 25);
      issues = [
        'Insurance expiring within 30 days',
        'Minor documentation mismatch',
      ].slice(0, Math.floor(Math.random() * 2) + 1);
    } else {
      compliance = 'non-compliant';
      score = 20 + Math.floor(Math.random() * 40);
      issues = [
        'RC expired',
        'Insurance not valid',
        'Fitness certificate missing',
        'Permit violation',
      ].slice(0, Math.floor(Math.random() * 3) + 1);
    }

    return {
      ...item,
      status: 'completed',
      result: { compliance, score, issues },
      processedAt: new Date().toISOString(),
    };
  }, []);

  const startProcessing = useCallback(async () => {
    setIsProcessing(true);
    setIsPaused(false);

    const pendingItems = items.filter(i => i.status === 'pending');
    
    for (const item of pendingItems) {
      if (isPaused) break;

      // Update status to processing
      setItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, status: 'processing' as const } : i
      ));

      try {
        const result = await simulateVerification(item);
        setItems(prev => prev.map(i => 
          i.id === item.id ? result : i
        ));
      } catch (error) {
        setItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, status: 'failed' as const } : i
        ));
      }
    }

    setIsProcessing(false);
    
    if (onScanComplete) {
      const completedItems = items.filter(i => i.status === 'completed');
      onScanComplete(completedItems);
    }
  }, [items, isPaused, simulateVerification, onScanComplete]);

  const pauseProcessing = () => {
    setIsPaused(true);
  };

  const exportResults = () => {
    const completedItems = items.filter(i => i.status === 'completed');
    const csv = [
      ['Vehicle Number', 'Status', 'Score', 'Issues', 'Processed At'],
      ...completedItems.map(item => [
        item.vehicleNumber,
        item.result?.compliance || 'N/A',
        item.result?.score?.toString() || 'N/A',
        item.result?.issues.join('; ') || 'None',
        item.processedAt || 'N/A',
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-scan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: BulkScanItem['status'], compliance?: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        if (compliance === 'compliant') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        if (compliance === 'non-compliant') return <XCircle className="w-4 h-4 text-red-500" />;
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Bulk Scanner</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Process multiple vehicles at checkpoint speed
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Input Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Single Input */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Single Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Input
                placeholder="MH 12 AB 1234"
                value={singleInput}
                onChange={(e) => setSingleInput(e.target.value.toUpperCase())}
                className="uppercase"
                onKeyDown={(e) => e.key === 'Enter' && addSingleVehicle()}
              />
              <Button onClick={addSingleVehicle}>Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Input */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Bulk Import
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder="Paste vehicle numbers (one per line, or comma separated)"
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="min-h-[80px] text-xs"
            />
            <Button onClick={addFromBulkInput} className="w-full mt-2" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import Vehicles
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      {items.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Progress: {processedCount} / {items.length}
                  </span>
                  {isProcessing && (
                    <Badge variant="outline" className="text-blue-500">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Processing
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    {compliantCount} Compliant
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                    {warningCount} Warning
                  </span>
                  <span className="flex items-center gap-1">
                    <XCircle className="w-3 h-3 text-red-500" />
                    {nonCompliantCount} Non-compliant
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {!isProcessing ? (
                  <Button onClick={startProcessing} disabled={items.filter(i => i.status === 'pending').length === 0}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Scan
                  </Button>
                ) : (
                  <Button onClick={pauseProcessing} variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button variant="outline" onClick={exportResults} disabled={processedCount === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="ghost" onClick={clearAll}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Results Table */}
      {items.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Status</TableHead>
                  <TableHead>Vehicle Number</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow 
                    key={item.id}
                    className={cn(
                      item.result?.compliance === 'non-compliant' && 'bg-red-500/5',
                      item.result?.compliance === 'warning' && 'bg-yellow-500/5',
                      item.result?.compliance === 'compliant' && 'bg-green-500/5'
                    )}
                  >
                    <TableCell>
                      {getStatusIcon(item.status, item.result?.compliance)}
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {item.vehicleNumber}
                    </TableCell>
                    <TableCell>
                      {item.result && (
                        <Badge 
                          variant="outline"
                          className={cn(
                            item.result.compliance === 'compliant' && 'text-green-500 border-green-500/30',
                            item.result.compliance === 'warning' && 'text-yellow-500 border-yellow-500/30',
                            item.result.compliance === 'non-compliant' && 'text-red-500 border-red-500/30'
                          )}
                        >
                          {item.result.compliance}
                        </Badge>
                      )}
                      {item.status === 'pending' && (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      )}
                      {item.status === 'processing' && (
                        <span className="text-xs text-blue-500">Processing...</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.result?.score !== undefined && (
                        <span className={cn(
                          'font-medium',
                          item.result.score >= 80 && 'text-green-500',
                          item.result.score >= 50 && item.result.score < 80 && 'text-yellow-500',
                          item.result.score < 50 && 'text-red-500'
                        )}>
                          {item.result.score}%
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.result?.issues && item.result.issues.length > 0 ? (
                        <div className="text-xs text-muted-foreground">
                          {item.result.issues.slice(0, 2).map((issue, i) => (
                            <div key={i} className="truncate max-w-[200px]">• {issue}</div>
                          ))}
                          {item.result.issues.length > 2 && (
                            <div className="text-[10px] text-muted-foreground/70">
                              +{item.result.issues.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : item.status === 'completed' ? (
                        <span className="text-xs text-green-500">No issues</span>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeItem(item.id)}
                        disabled={item.status === 'processing'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-medium mb-2">No vehicles to scan</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add vehicle numbers manually or import from a list to begin bulk scanning
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => document.getElementById('singleInput')?.focus()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
              <Button variant="outline" onClick={() => document.getElementById('bulkInput')?.focus()}>
                <Upload className="w-4 h-4 mr-2" />
                Import List
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
