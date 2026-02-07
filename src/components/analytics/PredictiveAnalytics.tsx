// GateZero - Predictive Analytics Component
// AI-powered compliance forecasting and trend analysis

import { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Brain, Target, Calendar,
  AlertTriangle, Shield, Clock, ArrowRight, Sparkles,
  LineChart, BarChart3, PieChart, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface PredictionData {
  metric: string;
  current: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: string;
}

interface RiskPrediction {
  category: string;
  riskScore: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: string[];
  recommendation: string;
}

interface ExpiryForecast {
  documentType: string;
  expiringThisWeek: number;
  expiringThisMonth: number;
  expiringThisQuarter: number;
  percentageOfFleet: number;
}

interface PredictiveAnalyticsProps {
  complianceRate?: number;
  totalVehicles?: number;
  recentScans?: number;
}

export function PredictiveAnalytics({ 
  complianceRate = 78, 
  totalVehicles = 1250,
  recentScans = 3450 
}: PredictiveAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  // Mock prediction data - in production, this would come from AI analysis
  const predictions: PredictionData[] = [
    {
      metric: 'Compliance Rate',
      current: complianceRate,
      predicted: complianceRate + 3.5,
      trend: 'up',
      confidence: 87,
      timeframe: 'Next 30 days',
    },
    {
      metric: 'Non-Compliance Cases',
      current: 156,
      predicted: 142,
      trend: 'down',
      confidence: 82,
      timeframe: 'Next 30 days',
    },
    {
      metric: 'Document Expiries',
      current: 89,
      predicted: 124,
      trend: 'up',
      confidence: 94,
      timeframe: 'Next 30 days',
    },
    {
      metric: 'Verification Volume',
      current: recentScans,
      predicted: Math.round(recentScans * 1.12),
      trend: 'up',
      confidence: 78,
      timeframe: 'Next 30 days',
    },
  ];

  const riskPredictions: RiskPrediction[] = [
    {
      category: 'Insurance Compliance',
      riskScore: 35,
      trend: 'increasing',
      factors: ['Seasonal renewal patterns', 'Price increases expected'],
      recommendation: 'Initiate early renewal reminders for 45 vehicles',
    },
    {
      category: 'Permit Violations',
      riskScore: 22,
      trend: 'stable',
      factors: ['New route restrictions announced', 'Permit rule changes pending'],
      recommendation: 'Review permits for interstate vehicles by month-end',
    },
    {
      category: 'Fitness Certificate',
      riskScore: 48,
      trend: 'decreasing',
      factors: ['Recent bulk renewals completed', 'Proactive maintenance program'],
      recommendation: 'Schedule 12 pending fitness inspections',
    },
    {
      category: 'Overloading',
      riskScore: 61,
      trend: 'increasing',
      factors: ['Festival season approaching', 'High cargo demand'],
      recommendation: 'Deploy additional weighbridge checks on key routes',
    },
  ];

  const expiryForecasts: ExpiryForecast[] = [
    { documentType: 'Insurance', expiringThisWeek: 12, expiringThisMonth: 45, expiringThisQuarter: 156, percentageOfFleet: 12.5 },
    { documentType: 'Fitness Certificate', expiringThisWeek: 8, expiringThisMonth: 34, expiringThisQuarter: 89, percentageOfFleet: 7.1 },
    { documentType: 'Road Tax', expiringThisWeek: 3, expiringThisMonth: 18, expiringThisQuarter: 67, percentageOfFleet: 5.4 },
    { documentType: 'Permit', expiringThisWeek: 5, expiringThisMonth: 22, expiringThisQuarter: 78, percentageOfFleet: 6.2 },
    { documentType: 'PUC', expiringThisWeek: 23, expiringThisMonth: 89, expiringThisQuarter: 234, percentageOfFleet: 18.7 },
  ];

  const aiInsights = [
    {
      type: 'opportunity',
      title: 'Cost Optimization Detected',
      description: 'Bulk insurance renewal for 45 vehicles could save ₹2.3L. Optimal timing: next 2 weeks.',
      action: 'View renewal plan',
      icon: <Target className="w-4 h-4" />,
    },
    {
      type: 'warning',
      title: 'Compliance Dip Expected',
      description: 'Historical data suggests 8% compliance drop during festival week. Plan preemptive checks.',
      action: 'Schedule checks',
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      type: 'trend',
      title: 'Route Performance Shift',
      description: 'NH-48 corridor showing 15% more violations. Consider dedicated compliance team.',
      action: 'Analyze route',
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up' || trend === 'increasing') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down' || trend === 'decreasing') return <TrendingDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getTrendColor = (trend: string, inverse = false) => {
    const isPositive = trend === 'up' || trend === 'increasing';
    if (inverse) {
      return isPositive ? 'text-red-500' : 'text-green-500';
    }
    return isPositive ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-violet-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Predictive Analytics
                  <Badge variant="outline" className="text-violet-500 border-violet-500/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Forecasts based on historical patterns and real-time data
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="w-3 h-3 mr-2" />
                Last 90 days
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {predictions.map((pred, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-muted-foreground">{pred.metric}</p>
                <Badge 
                  variant="outline" 
                  className={cn(
                    'text-[10px]',
                    pred.trend === 'up' && 'text-green-500 border-green-500/30',
                    pred.trend === 'down' && 'text-red-500 border-red-500/30',
                    pred.trend === 'stable' && 'text-blue-500 border-blue-500/30'
                  )}
                >
                  {getTrendIcon(pred.trend)}
                </Badge>
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold">{pred.current}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className={cn(
                  'text-2xl font-bold',
                  getTrendColor(pred.trend, pred.metric === 'Non-Compliance Cases')
                )}>
                  {typeof pred.predicted === 'number' ? pred.predicted.toFixed(1) : pred.predicted}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">{pred.timeframe}</span>
                  <span className="text-muted-foreground">{pred.confidence}% confidence</span>
                </div>
                <Progress value={pred.confidence} className="h-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.map((insight, index) => (
              <div 
                key={index}
                className={cn(
                  'p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer',
                  insight.type === 'opportunity' && 'bg-green-500/5 border-green-500/20 hover:border-green-500/40',
                  insight.type === 'warning' && 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40',
                  insight.type === 'trend' && 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    insight.type === 'opportunity' && 'bg-green-500/10 text-green-500',
                    insight.type === 'warning' && 'bg-amber-500/10 text-amber-500',
                    insight.type === 'trend' && 'bg-blue-500/10 text-blue-500'
                  )}>
                    {insight.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      {insight.action} →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Predictions & Expiry Forecasts */}
      <Tabs defaultValue="risk" className="space-y-4">
        <TabsList>
          <TabsTrigger value="risk" className="gap-2">
            <Shield className="w-4 h-4" />
            Risk Predictions
          </TabsTrigger>
          <TabsTrigger value="expiry" className="gap-2">
            <Clock className="w-4 h-4" />
            Expiry Forecast
          </TabsTrigger>
        </TabsList>

        <TabsContent value="risk">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskPredictions.map((risk, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-sm">{risk.category}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          'text-xs',
                          getTrendColor(risk.trend, true)
                        )}>
                          {risk.trend === 'increasing' ? '↑ Increasing' : risk.trend === 'decreasing' ? '↓ Decreasing' : '→ Stable'}
                        </span>
                      </div>
                    </div>
                    <div className={cn(
                      'text-2xl font-bold',
                      risk.riskScore < 30 && 'text-green-500',
                      risk.riskScore >= 30 && risk.riskScore < 60 && 'text-yellow-500',
                      risk.riskScore >= 60 && 'text-red-500'
                    )}>
                      {risk.riskScore}
                    </div>
                  </div>

                  <Progress 
                    value={risk.riskScore} 
                    className={cn(
                      'h-2 mb-3',
                      risk.riskScore < 30 && '[&>div]:bg-green-500',
                      risk.riskScore >= 30 && risk.riskScore < 60 && '[&>div]:bg-yellow-500',
                      risk.riskScore >= 60 && '[&>div]:bg-red-500'
                    )}
                  />

                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1">Risk Factors:</p>
                      <div className="flex flex-wrap gap-1">
                        {risk.factors.map((factor, i) => (
                          <Badge key={i} variant="outline" className="text-[10px]">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Recommendation:</strong> {risk.recommendation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expiry">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 text-sm font-medium">Document Type</th>
                      <th className="text-center p-4 text-sm font-medium">This Week</th>
                      <th className="text-center p-4 text-sm font-medium">This Month</th>
                      <th className="text-center p-4 text-sm font-medium">This Quarter</th>
                      <th className="text-center p-4 text-sm font-medium">% of Fleet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiryForecasts.map((forecast, index) => (
                      <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-4 font-medium text-sm">{forecast.documentType}</td>
                        <td className="p-4 text-center">
                          <Badge variant={forecast.expiringThisWeek > 10 ? 'destructive' : 'secondary'}>
                            {forecast.expiringThisWeek}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={forecast.expiringThisMonth > 50 ? 'destructive' : 'outline'}>
                            {forecast.expiringThisMonth}
                          </Badge>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">
                          {forecast.expiringThisQuarter}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={forecast.percentageOfFleet} className="w-20 h-1.5" />
                            <span className="text-xs text-muted-foreground w-12">
                              {forecast.percentageOfFleet}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <LineChart className="w-4 h-4" />
              Compliance Trend Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
              <div className="text-center">
                <LineChart className="w-12 h-12 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Trend chart visualization</p>
                <p className="text-xs text-muted-foreground/70">Connect to real data for live charts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Violation Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Distribution chart visualization</p>
                <p className="text-xs text-muted-foreground/70">Connect to real data for live charts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
