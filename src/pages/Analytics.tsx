// GateZero - Analytics Page
// Advanced analytics with AI-powered predictions

import { Brain, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PredictiveAnalytics } from '@/components/analytics/PredictiveAnalytics';
import { AppLayout } from '@/components/layout/AppLayout';

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Analytics</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">AI-powered insights and predictions</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Date Range</span>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Export Report</span>
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
