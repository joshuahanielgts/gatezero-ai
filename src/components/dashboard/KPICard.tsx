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
    <div className="bg-card rounded-xl border border-border p-4 sm:p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0", styles.iconBg)}>
              <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", styles.iconColor)} />
            </div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
          </div>
          
          <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
            <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            </p>
            {trend && (
              <span className={cn("text-xs sm:text-sm font-medium", styles.trendColor)}>
                {trend}
              </span>
            )}
          </div>
          
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>
        
        {chart && (
          <div className="w-16 h-12 sm:w-24 sm:h-16 shrink-0">
            {chart}
          </div>
        )}
      </div>
    </div>
  );
}
