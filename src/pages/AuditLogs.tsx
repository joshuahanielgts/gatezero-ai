import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGateLogs } from "@/hooks";
import { VehicleNumber, EWayBillNumber } from "@/components/ui/mono-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Check, X, Globe, Clock, Server, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { VerdictType, GateLog } from "@/types/database.types";

type StatusFilter = 'all' | 'APPROVED' | 'BLOCKED';

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { logs, isLoading, error, hasMore, loadMore } = useGateLogs({
    verdict: statusFilter === 'all' ? undefined : statusFilter as VerdictType,
    realtime: true,
  });

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.vehicle_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.eway_bill_no?.includes(searchQuery) ?? false);
    return matchesSearch;
  });

  const handleExport = () => {
    if (logs.length === 0) {
      toast.error("No logs to export");
      return;
    }
    
    // Create CSV content
    const headers = ['Timestamp', 'Vehicle No', 'E-Way Bill', 'Verdict', 'Compliance Score', 'Scan Duration (ms)'];
    const rows = logs.map(log => [
      log.timestamp,
      log.vehicle_no,
      log.eway_bill_no || '',
      log.verdict,
      log.compliance_score?.toString() || '',
      log.scan_duration_ms?.toString() || '',
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gatezero-audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Audit logs exported to CSV");
  };

  const renderCheckStatus = (status: string) => {
    switch (status) {
      case 'passed':
        return <Check className="w-4 h-4 text-safe" />;
      case 'failed':
        return <X className="w-4 h-4 text-blocked" />;
      default:
        return <AlertCircle className="w-4 h-4 text-expiring" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Complete forensic trail of all verification attempts
            </p>
          </div>
          <Button variant="outline" onClick={handleExport} disabled={logs.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by vehicle or E-Way Bill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(v: StatusFilter) => setStatusFilter(v)}>
            <SelectTrigger className="w-40 bg-card border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs */}
        <div className="bg-card rounded-xl border border-border">
          {isLoading && logs.length === 0 ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No audit logs found
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredLogs.map((log: GateLog) => (
                <AccordionItem 
                  key={log.id} 
                  value={log.id}
                  className="border-border"
                >
                  <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/30">
                    <div className="flex items-center gap-4 w-full text-left">
                      {/* Status Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        log.verdict === 'APPROVED' ? "bg-safe/10" : "bg-blocked/10"
                      )}>
                        {log.verdict === 'APPROVED' ? (
                          <Check className="w-5 h-5 text-safe" />
                        ) : (
                          <X className="w-5 h-5 text-blocked" />
                        )}
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Date/Time</p>
                          <p className="text-sm text-foreground">
                            {format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Vehicle</p>
                          <VehicleNumber number={log.vehicle_no} />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">E-Way Bill</p>
                          <EWayBillNumber number={log.eway_bill_no || 'N/A'} />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Outcome</p>
                          <StatusBadge status={log.verdict === 'APPROVED' ? 'approved' : 'blocked'}>
                            {log.verdict}
                          </StatusBadge>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4">
                    <div className="ml-14 space-y-6">
                      {/* Metadata */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Operator IP</p>
                            <p className="font-mono text-sm text-foreground">{log.operator_ip || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Scan Duration</p>
                            <p className="font-mono text-sm text-foreground">
                              {log.scan_duration_ms ? `${log.scan_duration_ms}ms` : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Compliance Score</p>
                            <p className="font-mono text-sm text-foreground">
                              {log.compliance_score ?? 'N/A'}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Checks */}
                      {log.metadata?.checks && log.metadata.checks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Verification Checks</h4>
                          <div className="space-y-2">
                            {log.metadata.checks.map((check, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  {renderCheckStatus(check.status)}
                                  <span className="text-sm text-foreground">{check.name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{check.details}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* QR Code Hash */}
                      {log.qr_code_hash && (
                        <div className="p-3 bg-safe/10 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Gate Pass QR Code</p>
                          <p className="font-mono text-sm text-safe">{log.qr_code_hash}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {/* Load More */}
          {hasMore && !isLoading && (
            <div className="p-4 border-t border-border">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={loadMore}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
