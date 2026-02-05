import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

interface RiskGaugeProps {
  value: number;
  level: 'Low' | 'Medium' | 'High';
}

export function RiskGauge({ value, level }: RiskGaugeProps) {
  const color = level === 'Low' 
    ? 'hsl(160, 84%, 39%)' 
    : level === 'Medium' 
      ? 'hsl(38, 92%, 50%)' 
      : 'hsl(347, 77%, 50%)';

  const data = [{ value, fill: color }];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius="70%" 
        outerRadius="100%" 
        data={data} 
        startAngle={180} 
        endAngle={0}
      >
        <PolarAngleAxis 
          type="number" 
          domain={[0, 100]} 
          angleAxisId={0} 
          tick={false} 
        />
        <RadialBar
          background={{ fill: 'hsl(var(--muted))' }}
          dataKey="value"
          angleAxisId={0}
          cornerRadius={10}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
