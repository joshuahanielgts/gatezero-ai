import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { weeklyTrendData } from "@/data/mockData";

export function TrendChart() {
  return (
    <div className="bg-card rounded-xl border border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Compliance Trends</h3>
        <p className="text-xs text-muted-foreground mt-1">Pass vs Blocked - Last 7 Days</p>
      </div>
      
      <div className="flex-1 p-4 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
      </div>
    </div>
  );
}
