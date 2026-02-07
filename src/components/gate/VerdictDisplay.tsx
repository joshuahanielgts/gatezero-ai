import { useState, useEffect } from "react";
import { Shield, ShieldX, Check, X, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateBillInsights, isGeminiConfigured, type BillInsights } from "@/services/geminiService";
import type { Vehicle, Driver } from "@/types/database.types";

interface VerdictDisplayProps {
  outcome: 'approved' | 'blocked';
  vehicleNo: string;
  eWayBill: string;
  checks: { name: string; status: 'passed' | 'failed' | 'warning'; details: string }[];
  errors?: string[];
  vehicle?: Partial<Vehicle> | null;
  driver?: Partial<Driver> | null;
  onIssuePass?: () => void;
  onReset: () => void;
}

export function VerdictDisplay({
  outcome,
  vehicleNo,
  eWayBill,
  checks,
  errors,
  vehicle,
  driver,
  onIssuePass,
  onReset,
}: VerdictDisplayProps) {
  const isApproved = outcome === 'approved';
  const [aiInsights, setAiInsights] = useState<BillInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!isGeminiConfigured()) return;
      
      setIsLoadingInsights(true);
      try {
        const insights = await generateBillInsights(eWayBill, vehicle || null, driver || null, checks);
        setAiInsights(insights);
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
      } finally {
        setIsLoadingInsights(false);
      }
    };

    fetchInsights();
  }, [eWayBill, vehicle, driver, checks]);

  return (
    <div className="max-w-xl mx-auto text-center animate-fade-in px-2 sm:px-0">
      {/* Verdict Shield */}
      <div className="relative mb-4 sm:mb-6">
        <div className={cn(
          "w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center mx-auto",
          isApproved 
            ? "bg-safe/10 pulse-safe card-glow-safe" 
            : "bg-blocked/10 pulse-blocked card-glow-blocked"
        )}>
          {isApproved ? (
            <Shield className="w-14 h-14 sm:w-20 sm:h-20 text-safe" />
          ) : (
            <ShieldX className="w-14 h-14 sm:w-20 sm:h-20 text-blocked" />
          )}
        </div>
      </div>

      {/* Verdict Text */}
      <h1 className={cn(
        "text-2xl sm:text-3xl font-bold mb-2 tracking-tight",
        isApproved ? "text-safe" : "text-blocked"
      )}>
        {isApproved ? "DISPATCH APPROVED" : "DISPATCH BLOCKED"}
      </h1>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 mb-4 sm:mb-6">
        <p className="font-mono text-base sm:text-lg text-foreground">{vehicleNo}</p>
        <span className="text-muted-foreground hidden sm:block">•</span>
        <p className="font-mono text-xs sm:text-sm text-muted-foreground">{eWayBill}</p>
      </div>

      {/* Checks Summary */}
      <div className="bg-card rounded-xl border border-border p-3 sm:p-4 mb-4 sm:mb-6 text-left">
        <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Verification Summary</h3>
        <div className="space-y-1.5 sm:space-y-2">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0",
                check.status === 'passed' && "bg-safe/20",
                check.status === 'failed' && "bg-blocked/20",
                check.status === 'warning' && "bg-expiring/20"
              )}>
                {check.status === 'passed' && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-safe" />}
                {check.status === 'failed' && <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blocked" />}
                {check.status === 'warning' && <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-expiring" />}
              </div>
              <span className="text-muted-foreground flex-1 truncate">{check.name}</span>
              <span className={cn(
                "text-[10px] sm:text-xs shrink-0",
                check.status === 'passed' && "text-safe",
                check.status === 'failed' && "text-blocked",
                check.status === 'warning' && "text-expiring"
              )}>
                {check.status === 'passed' ? 'Passed' : check.status === 'failed' ? 'Failed' : 'Warning'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Panel */}
      {isGeminiConfigured() && (
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-left">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
            AI Insights
            {isLoadingInsights && <Loader2 className="w-3 h-3 animate-spin text-purple-400" />}
          </h3>
          
          {isLoadingInsights ? (
            <p className="text-xs sm:text-sm text-muted-foreground">Analyzing verification data...</p>
          ) : aiInsights ? (
            <div className="space-y-3">
              {/* Summary */}
              <p className="text-xs sm:text-sm text-foreground">{aiInsights.summary}</p>
              
              {/* Risk Level Badge */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs text-muted-foreground">Risk Level:</span>
                <span className={cn(
                  "text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium",
                  aiInsights.estimatedRiskLevel === 'LOW' && "bg-safe/20 text-safe",
                  aiInsights.estimatedRiskLevel === 'MEDIUM' && "bg-expiring/20 text-expiring",
                  aiInsights.estimatedRiskLevel === 'HIGH' && "bg-blocked/20 text-blocked"
                )}>
                  {aiInsights.estimatedRiskLevel}
                </span>
              </div>

              {/* Risk Factors */}
              {aiInsights.riskFactors.length > 0 && (
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Risk Factors:</p>
                  <ul className="space-y-1">
                    {aiInsights.riskFactors.map((factor, i) => (
                      <li key={i} className="text-[10px] sm:text-xs text-blocked flex items-start gap-1.5">
                        <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {aiInsights.recommendations.length > 0 && (
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Recommendations:</p>
                  <ul className="space-y-1">
                    {aiInsights.recommendations.map((rec, i) => (
                      <li key={i} className="text-[10px] sm:text-xs text-purple-300 flex items-start gap-1.5">
                        <Sparkles className="w-3 h-3 shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground">Unable to generate insights</p>
          )}
        </div>
      )}

      {/* Errors (for blocked) */}
      {errors && errors.length > 0 && (
        <div className="bg-blocked/10 border border-blocked/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-left">
          <h3 className="text-xs sm:text-sm font-semibold text-blocked mb-2 sm:mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Violation Report
          </h3>
          <ul className="space-y-1.5 sm:space-y-2">
            {errors.map((error, index) => (
              <li key={index} className="text-xs sm:text-sm text-blocked flex items-start gap-2">
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          variant="outline"
          className="flex-1 h-10 sm:h-11"
          onClick={onReset}
        >
          New Scan
        </Button>
        
        {isApproved && onIssuePass && (
          <Button
            className="flex-1 h-10 sm:h-11 bg-safe hover:bg-safe/90 text-safe-foreground"
            onClick={onIssuePass}
          >
            ISSUE GATE PASS
          </Button>
        )}
      </div>
    </div>
  );
}
