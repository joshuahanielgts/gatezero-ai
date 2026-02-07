import { Shield, ShieldX, RefreshCw } from "lucide-react";
import { VehicleNumber } from "@/components/ui/mono-text";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useDashboardMetrics } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LiveFeed() {
  const { recentEvents, isLoading, refetch } = useDashboardMetrics();

  return (
    <div className="bg-card rounded-xl border border-border h-full flex flex-col">
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Live Feed</h3>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-3.5 w-3.5 text-muted-foreground", isLoading && "animate-spin")} />
            </Button>
            <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {isLoading ? "Updating..." : "Real-time"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-dark">
        {isLoading && recentEvents.length === 0 ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No recent events
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentEvents.map((event, index) => (
              <div 
                key={event.id} 
                className={cn(
                  "p-3 sm:p-4 hover:bg-muted/30 transition-colors animate-fade-in",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0",
                    event.verdict === 'APPROVED' 
                      ? "bg-safe/10" 
                      : "bg-blocked/10"
                  )}>
                    {event.verdict === 'APPROVED' ? (
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-safe" />
                    ) : (
                      <ShieldX className="w-4 h-4 sm:w-5 sm:h-5 text-blocked" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <VehicleNumber number={event.vehicle_no} />
                      <span className={cn(
                        "text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full",
                        event.verdict === 'APPROVED'
                          ? "bg-safe/20 text-safe"
                          : "bg-blocked/20 text-blocked"
                      )}>
                        {event.verdict}
                      </span>
                    </div>
                    {event.eway_bill_no && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                        E-Way: {event.eway_bill_no}
                      </p>
                    )}
                  </div>
                  
                  <p className="text-[10px] sm:text-xs text-muted-foreground shrink-0 hidden xs:block">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
