import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useDashboardMetrics } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export function TrendChart() {
  const { weeklyTrend, isLoading } = useDashboardMetrics();

  // Transform data for the chart
  const chartData = weeklyTrend.map(d => ({
    day: d.day,
    passed: d.approved,
    blocked: d.blocked,
  }));

  return (
    <div className="bg-card rounded-xl border border-border h-full flex flex-col">
      <div className="p-3 sm:p-4 border-b border-border">
        <h3 className="font-semibold text-foreground text-sm sm:text-base">Compliance Trends</h3>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Pass vs Blocked - Last 7 Days</p>
      </div>
      
      <div className="flex-1 p-2 sm:p-4 min-h-[250px] sm:min-h-[300px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="space-y-4 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            No trend data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => (
                  <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '12px' }}>
                    {value}
                  </span>
                )}
              />
              <Bar 
                dataKey="passed" 
                name="Passed" 
                fill="hsl(160, 84%, 39%)" 
                radius={[4, 4, 0, 0]} 
                stackId="a"
              />
              <Bar 
                dataKey="blocked" 
                name="Blocked" 
                fill="hsl(347, 77%, 50%)" 
                radius={[4, 4, 0, 0]} 
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
