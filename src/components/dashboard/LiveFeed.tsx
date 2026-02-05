import { Shield, ShieldX, RefreshCw } from "lucide-react";
import { VehicleNumber } from "@/components/ui/mono-text";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { getLiveGateEvents } from "@/data/liveDataSimulator";
import { Button } from "@/components/ui/button";

export function LiveFeed() {
  const { data: events, lastUpdated, isRefreshing, refresh } = useAutoRefresh(
    getLiveGateEvents,
    { interval: 30000 }
  );

  return (
    <div className="bg-card rounded-xl border border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Live Feed</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={refresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-3.5 w-3.5 text-muted-foreground", isRefreshing && "animate-spin")} />
            </Button>
            <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <span className="text-xs text-muted-foreground">
              {isRefreshing ? "Updating..." : "Real-time"}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-dark">
        <div className="divide-y divide-border">
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className={cn(
                "p-4 hover:bg-muted/30 transition-colors animate-fade-in",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  event.outcome === 'Approved' 
                    ? "bg-safe/10" 
                    : "bg-blocked/10"
                )}>
                  {event.outcome === 'Approved' ? (
                    <Shield className="w-5 h-5 text-safe" />
                  ) : (
                    <ShieldX className="w-5 h-5 text-blocked" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <VehicleNumber number={event.vehicleNo} />
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      event.outcome === 'Approved'
                        ? "bg-safe/20 text-safe"
                        : "bg-blocked/20 text-blocked"
                    )}>
                      {event.outcome}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    E-Way: {event.eWayBillNo}
                  </p>
                </div>
                
                <p className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
