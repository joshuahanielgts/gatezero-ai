import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'approved' | 'blocked' | 'warning' | 'expired' | 'active' | 'inactive' | 'expiring';
  children: React.ReactNode;
  className?: string;
}

const statusStyles = {
  approved: "bg-safe/20 text-safe border-safe/30",
  active: "bg-safe/20 text-safe border-safe/30",
  blocked: "bg-blocked/20 text-blocked border-blocked/30",
  expired: "bg-blocked/20 text-blocked border-blocked/30",
  inactive: "bg-muted text-muted-foreground border-muted",
  warning: "bg-expiring/20 text-expiring border-expiring/30",
  expiring: "bg-expiring/20 text-expiring border-expiring/30",
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High';
  className?: string;
}

const riskStyles = {
  Low: "bg-safe/20 text-safe border-safe/30",
  Medium: "bg-expiring/20 text-expiring border-expiring/30",
  High: "bg-blocked/20 text-blocked border-blocked/30",
};

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        riskStyles[level],
        className
      )}
    >
      {level} Risk
    </span>
  );
}

interface TripStatusBadgeProps {
  status: 'On Route' | 'Delayed' | 'At Destination' | 'Loading' | 'Unloading';
  className?: string;
}

const tripStatusStyles = {
  'On Route': { dot: 'bg-safe', text: 'text-safe' },
  'Delayed': { dot: 'bg-expiring', text: 'text-expiring' },
  'At Destination': { dot: 'bg-chart-4', text: 'text-chart-4' },
  'Loading': { dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
  'Unloading': { dot: 'bg-chart-5', text: 'text-chart-5' },
};

export function TripStatusBadge({ status, className }: TripStatusBadgeProps) {
  const style = tripStatusStyles[status];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("w-2 h-2 rounded-full", style.dot)} />
      <span className={cn("text-xs font-medium", style.text)}>{status}</span>
    </span>
  );
}
