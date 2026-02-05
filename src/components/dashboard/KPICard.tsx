import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  description: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  chart?: React.ReactNode;
}

const variantStyles = {
  default: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    trendColor: "text-muted-foreground",
  },
  success: {
    iconBg: "bg-safe/10",
    iconColor: "text-safe",
    trendColor: "text-safe",
  },
  danger: {
    iconBg: "bg-blocked/10",
    iconColor: "text-blocked",
    trendColor: "text-blocked",
  },
  warning: {
    iconBg: "bg-expiring/10",
    iconColor: "text-expiring",
    trendColor: "text-expiring",
  },
};

export function KPICard({
  title,
  value,
  trend,
  description,
  icon: Icon,
  variant = 'default',
  chart,
}: KPICardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", styles.iconBg)}>
              <Icon className={cn("w-5 h-5", styles.iconColor)} />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            </p>
            {trend && (
              <span className={cn("text-sm font-medium", styles.trendColor)}>
                {trend}
              </span>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        
        {chart && (
          <div className="w-24 h-16">
            {chart}
          </div>
        )}
      </div>
    </div>
  );
}
