import { cn } from "@/lib/utils";

interface MonoTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div';
}

export function MonoText({ children, className, as: Component = 'span' }: MonoTextProps) {
  return (
    <Component className={cn("font-mono text-sm tracking-wide", className)}>
      {children}
    </Component>
  );
}

interface VehicleNumberProps {
  number: string;
  className?: string;
}

export function VehicleNumber({ number, className }: VehicleNumberProps) {
  return (
    <span className={cn("font-mono text-sm tracking-wide text-foreground", className)}>
      {number}
    </span>
  );
}

interface EWayBillNumberProps {
  number: string;
  className?: string;
}

export function EWayBillNumber({ number, className }: EWayBillNumberProps) {
  return (
    <span className={cn("font-mono text-xs tracking-wider text-muted-foreground", className)}>
      {number}
    </span>
  );
}

interface GSTINProps {
  gstin: string;
  className?: string;
}

export function GSTIN({ gstin, className }: GSTINProps) {
  return (
    <span className={cn("font-mono text-xs tracking-wide text-muted-foreground", className)}>
      {gstin}
    </span>
  );
}
