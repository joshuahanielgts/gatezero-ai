import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { RiskGauge } from "@/components/dashboard/RiskGauge";
import { dashboardKPIs } from "@/data/mockData";
import { Gauge, ShieldX, IndianRupee, TrendingUp } from "lucide-react";

export default function CommandCenter() {
  const riskLevel = dashboardKPIs.riskScore.numericValue < 30 
    ? 'Low' 
    : dashboardKPIs.riskScore.numericValue < 60 
      ? 'Medium' 
      : 'High';

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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="Risk Score"
            value={dashboardKPIs.riskScore.value}
            trend={dashboardKPIs.riskScore.trend}
            description={dashboardKPIs.riskScore.description}
            icon={Gauge}
            variant={riskLevel === 'Low' ? 'success' : riskLevel === 'Medium' ? 'warning' : 'danger'}
            chart={<RiskGauge value={dashboardKPIs.riskScore.numericValue} level={riskLevel} />}
          />
          
          <KPICard
            title="Active Blocks"
            value={dashboardKPIs.activeBlocks.value}
            trend={dashboardKPIs.activeBlocks.trend}
            description={dashboardKPIs.activeBlocks.description}
            icon={ShieldX}
            variant="danger"
          />
          
          <KPICard
            title="Saved Penalties"
            value={`₹${(dashboardKPIs.savedPenalties.value / 1000).toFixed(0)}K`}
            trend={dashboardKPIs.savedPenalties.trend}
            description={dashboardKPIs.savedPenalties.description}
            icon={IndianRupee}
            variant="success"
          />
          
          <KPICard
            title="Compliance Rate"
            value={`${dashboardKPIs.complianceRate.value}%`}
            trend={dashboardKPIs.complianceRate.trend}
            description={dashboardKPIs.complianceRate.description}
            icon={TrendingUp}
            variant="success"
          />
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
