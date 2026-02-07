// GateZero - Analytics Page
// Advanced analytics with AI-powered predictions

import { Brain, BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PredictiveAnalytics } from '@/components/analytics/PredictiveAnalytics';
import { AppLayout } from '@/components/layout/AppLayout';

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-sm text-muted-foreground">AI-powered insights and predictions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

        {/* Predictive Analytics Component */}
        <PredictiveAnalytics 
          complianceRate={82}
          totalVehicles={1250}
          recentScans={3450}
        />
      </div>
    </AppLayout>
  );
}
