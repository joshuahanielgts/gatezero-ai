import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { auditLogs } from "@/data/mockData";
import { VehicleNumber, EWayBillNumber } from "@/components/ui/mono-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Search, Download, Check, X, AlertTriangle, Globe, Clock, Server } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type StatusFilter = 'all' | 'approved' | 'blocked';

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eWayBillNo.includes(searchQuery);
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && log.outcome.toLowerCase() === statusFilter;
  });

  const handleExport = () => {
    toast.success("Audit logs exported to CSV");
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
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs Accordion */}
        <div className="bg-card rounded-xl border border-border">
          <Accordion type="single" collapsible className="w-full">
            {filteredLogs.map((log) => (
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
                      log.outcome === 'Approved' ? "bg-safe/10" : "bg-blocked/10"
                    )}>
                      {log.outcome === 'Approved' ? (
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
                        <VehicleNumber number={log.vehicleNo} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">E-Way Bill</p>
                        <EWayBillNumber number={log.eWayBillNo} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Outcome</p>
                        <StatusBadge status={log.outcome === 'Approved' ? 'approved' : 'blocked'}>
                          {log.outcome}
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
                          <p className="text-xs text-muted-foreground">User IP</p>
                          <p className="font-mono text-sm text-foreground">{log.userIP}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Timestamp</p>
                          <p className="font-mono text-sm text-foreground">
                            {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Operator</p>
                          <p className="text-sm text-foreground">{log.operator}</p>
                        </div>
                      </div>
                    </div>

                    {/* Verification Steps */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">Verification Trail</h4>
                      <div className="space-y-2">
                        {log.checks.map((check, index) => (
                          <div 
                            key={index}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border",
                              check.status === 'passed' && "bg-safe/5 border-safe/20",
                              check.status === 'failed' && "bg-blocked/5 border-blocked/20",
                              check.status === 'warning' && "bg-expiring/5 border-expiring/20"
                            )}
                          >
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                              check.status === 'passed' && "bg-safe/20",
                              check.status === 'failed' && "bg-blocked/20",
                              check.status === 'warning' && "bg-expiring/20"
                            )}>
                              {check.status === 'passed' && <Check className="w-3.5 h-3.5 text-safe" />}
                              {check.status === 'failed' && <X className="w-3.5 h-3.5 text-blocked" />}
                              {check.status === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-expiring" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{check.name}</p>
                              <p className="text-xs text-muted-foreground">{check.details}</p>
                            </div>
                            <p className="text-xs font-mono text-muted-foreground shrink-0">
                              {format(new Date(check.timestamp), 'HH:mm:ss')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Errors (if any) */}
                    {log.errors && log.errors.length > 0 && (
                      <div className="p-4 bg-blocked/10 border border-blocked/20 rounded-lg">
                        <h4 className="text-sm font-semibold text-blocked mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Errors Detected
                        </h4>
                        <ul className="space-y-1">
                          {log.errors.map((error, index) => (
                            <li key={index} className="text-sm text-blocked flex items-start gap-2">
                              <X className="w-3 h-3 shrink-0 mt-1" />
                              {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* API Responses */}
                    {log.apiResponses && Object.keys(log.apiResponses.vahan).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">API Responses</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Vahan API</p>
                            <pre className="text-xs font-mono text-foreground overflow-x-auto">
                              {JSON.stringify(log.apiResponses.vahan, null, 2)}
                            </pre>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-2">GST API</p>
                            <pre className="text-xs font-mono text-foreground overflow-x-auto">
                              {JSON.stringify(log.apiResponses.gst, null, 2)}
                            </pre>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Insurance API</p>
                            <pre className="text-xs font-mono text-foreground overflow-x-auto">
                              {JSON.stringify(log.apiResponses.insurance, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No audit logs found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
