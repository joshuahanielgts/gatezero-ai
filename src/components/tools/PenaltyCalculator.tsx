// GateZero - Indian Transport Penalty Calculator
// Calculate fines based on Motor Vehicles Act violations

import { useState, useMemo } from 'react';
import { 
  Calculator, IndianRupee, AlertTriangle, Plus, Trash2,
  FileText, Download, Scale, Gavel
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { VIOLATION_TYPES_MAP, type ViolationInfo } from '@/types/premium.types';

interface SelectedViolation {
  id: string;
  violationTypeId: string;
  isRepeat: boolean;
  notes?: string;
}

interface PenaltyCalculatorProps {
  vehicleNumber?: string;
  driverName?: string;
  onGenerateReceipt?: (data: PenaltyReceipt) => void;
}

interface PenaltyReceipt {
  vehicleNumber: string;
  driverName: string;
  violations: SelectedViolation[];
  totalFine: number;
  generatedAt: string;
}

export function PenaltyCalculator({ 
  vehicleNumber = '', 
  driverName = '',
  onGenerateReceipt 
}: PenaltyCalculatorProps) {
  const [selectedViolations, setSelectedViolations] = useState<SelectedViolation[]>([]);
  const [vehicleInput, setVehicleInput] = useState(vehicleNumber);
  const [driverInput, setDriverInput] = useState(driverName);
  const [newViolationTypeId, setNewViolationTypeId] = useState<string>('');

  const addViolation = () => {
    if (!newViolationTypeId || !VIOLATION_TYPES_MAP[newViolationTypeId]) return;
    
    setSelectedViolations(prev => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        violationTypeId: newViolationTypeId,
        isRepeat: false,
        notes: '',
      }
    ]);
    setNewViolationTypeId('');
  };

  const removeViolation = (id: string) => {
    setSelectedViolations(prev => prev.filter(v => v.id !== id));
  };

  const toggleRepeat = (id: string) => {
    setSelectedViolations(prev => prev.map(v => 
      v.id === id ? { ...v, isRepeat: !v.isRepeat } : v
    ));
  };

  const updateNotes = (id: string, notes: string) => {
    setSelectedViolations(prev => prev.map(v => 
      v.id === id ? { ...v, notes } : v
    ));
  };

  const calculations = useMemo(() => {
    let subtotal = 0;
    let repeatPenalties = 0;
    const breakdown: { name: string; base: number; repeat: number; total: number }[] = [];

    selectedViolations.forEach(violation => {
      const type = VIOLATION_TYPES_MAP[violation.violationTypeId];
      if (!type) return;
      
      const baseFine = type.base_penalty;
      const repeatFine = violation.isRepeat ? type.max_penalty - type.base_penalty : 0;
      
      subtotal += baseFine;
      repeatPenalties += repeatFine;
      
      breakdown.push({
        name: type.name,
        base: baseFine,
        repeat: repeatFine,
        total: baseFine + repeatFine,
      });
    });

    return {
      subtotal,
      repeatPenalties,
      total: subtotal + repeatPenalties,
      breakdown,
    };
  }, [selectedViolations]);

  const handleGenerateReceipt = () => {
    if (!onGenerateReceipt) return;
    
    onGenerateReceipt({
      vehicleNumber: vehicleInput,
      driverName: driverInput,
      violations: selectedViolations,
      totalFine: calculations.total,
      generatedAt: new Date().toISOString(),
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Penalty Calculator</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on Motor Vehicles (Amendment) Act, 2019
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vehicle/Driver Info */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                placeholder="MH 12 AB 1234"
                value={vehicleInput}
                onChange={(e) => setVehicleInput(e.target.value.toUpperCase())}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverName">Driver Name</Label>
              <Input
                id="driverName"
                placeholder="Enter driver name"
                value={driverInput}
                onChange={(e) => setDriverInput(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Violation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Gavel className="w-4 h-4" />
            Add Violation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Select value={newViolationTypeId} onValueChange={setNewViolationTypeId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select violation type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(VIOLATION_TYPES_MAP).map(([key, violation]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{violation.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(violation.base_penalty)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addViolation} disabled={!newViolationTypeId}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Violations List */}
      {selectedViolations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Selected Violations ({selectedViolations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {selectedViolations.map((violation) => {
                const type = VIOLATION_TYPES_MAP[violation.violationTypeId];
                if (!type) return null;
                const fine = violation.isRepeat ? type.max_penalty : type.base_penalty;
                
                return (
                  <div 
                    key={violation.id}
                    className={cn(
                      'p-3 rounded-lg border transition-all',
                      violation.isRepeat ? 'bg-red-500/5 border-red-500/20' : 'bg-muted/30'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{type.name}</h4>
                            <p className="text-[10px] text-muted-foreground">
                              {type.section} • {type.description}
                            </p>
                          </div>
                          <Badge variant={violation.isRepeat ? 'destructive' : 'secondary'}>
                            {formatCurrency(fine)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`repeat-${violation.id}`}
                              checked={violation.isRepeat}
                              onCheckedChange={() => toggleRepeat(violation.id)}
                            />
                            <Label 
                              htmlFor={`repeat-${violation.id}`}
                              className="text-xs cursor-pointer"
                            >
                              Repeat offense ({formatCurrency(type.max_penalty)})
                            </Label>
                          </div>
                        </div>

                        <Input
                          placeholder="Add notes (optional)"
                          value={violation.notes}
                          onChange={(e) => updateNotes(violation.id, e.target.value)}
                          className="h-7 text-xs"
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        onClick={() => removeViolation(violation.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calculation Summary */}
      {selectedViolations.length > 0 && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Fine Calculation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Violation</TableHead>
                  <TableHead className="text-right">Base Fine</TableHead>
                  <TableHead className="text-right">Repeat</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculations.breakdown.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{item.name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.base)}</TableCell>
                    <TableCell className="text-right text-red-500">
                      {item.repeat > 0 ? `+${formatCurrency(item.repeat)}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(calculations.subtotal)}</span>
              </div>
              {calculations.repeatPenalties > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <span>Repeat Offense Penalties</span>
                  <span>+{formatCurrency(calculations.repeatPenalties)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Total Fine
                </span>
                <span className="text-primary">{formatCurrency(calculations.total)}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button 
                className="flex-1" 
                onClick={handleGenerateReceipt}
                disabled={!vehicleInput || !driverInput}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Receipt
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Reference */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">Quick Reference - Common Violations</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(VIOLATION_TYPES_MAP).slice(0, 6).map(([key, violation]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="h-auto py-2 px-3 flex-col items-start text-left"
                onClick={() => {
                  setSelectedViolations(prev => [
                    ...prev,
                    {
                      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      violationTypeId: key,
                      isRepeat: false,
                    }
                  ]);
                }}
              >
                <span className="text-xs font-medium truncate w-full">{violation.name}</span>
                <span className="text-[10px] text-muted-foreground">{formatCurrency(violation.base_penalty)}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
