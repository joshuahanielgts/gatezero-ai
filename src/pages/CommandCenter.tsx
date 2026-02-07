import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { useDashboardMetrics } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gauge, ShieldX, IndianRupee, TrendingUp, AlertCircle } from "lucide-react";

export default function CommandCenter() {
  const { metrics, isLoading, error } = useDashboardMetrics();

  const riskScore = metrics?.risk_score ?? 0;
  const riskLevel = riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : 'High';

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time compliance monitoring and fleet security overview
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))
          ) : (
            <>
              <KPICard
                title="Risk Score"
                value={riskScore.toString()}
                trend={riskScore < 30 ? 'down' : 'up'}
                description={`${riskLevel} risk level`}
                icon={Gauge}
                variant={riskLevel === 'Low' ? 'success' : riskLevel === 'Medium' ? 'warning' : 'danger'}
                chart={<RiskGauge value={riskScore} level={riskLevel} />}
              />
              
              <KPICard
                title="Active Blocks"
                value={(metrics?.active_blocks ?? 0).toString()}
                trend="neutral"
                description="Vehicles currently blocked"
                icon={ShieldX}
                variant="danger"
              />
              
              <KPICard
                title="Saved Penalties"
                value={`₹${((metrics?.saved_penalties_inr ?? 0) / 1000).toFixed(0)}K`}
                trend="up"
                description="Estimated savings this month"
                icon={IndianRupee}
                variant="success"
              />
              
              <KPICard
                title="Compliance Rate"
                value={`${metrics?.compliance_rate ?? 0}%`}
                trend={(metrics?.compliance_rate ?? 0) >= 90 ? 'up' : 'down'}
                description="Overall fleet compliance"
                icon={TrendingUp}
                variant="success"
              />
            </>
          )}
        </div>

        {/* Split View - Live Feed & Trend Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div className="h-[350px] sm:h-[400px] lg:h-[450px]">
            <LiveFeed />
          </div>
          <div className="h-[350px] sm:h-[400px] lg:h-[450px]">
            <TrendChart />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
