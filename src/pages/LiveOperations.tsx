import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLiveTrips, useDrivers } from "@/hooks";
import { VehicleNumber } from "@/components/ui/mono-text";
import { TripStatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Eye, Phone, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { TripStatus } from "@/types/database.types";

type FilterTab = 'All' | 'Loading' | 'On Route' | 'Delayed' | 'At Destination';

export default function LiveOperations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  const { trips, isLoading, error, refetch } = useLiveTrips({ 
    status: activeFilter === 'All' ? undefined : activeFilter as TripStatus,
    realtime: true 
  });
  const { drivers } = useDrivers();

  const filteredTrips = trips.filter((trip) => {
    const driver = drivers.find(d => d.id === trip.driver_id);
    const matchesSearch = trip.vehicle_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (driver?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesSearch;
  });

  const handleRefresh = async () => {
    await refetch();
    setLastRefresh(new Date());
    toast.success("Data refreshed");
  };

  const filters: FilterTab[] = ['All', 'Loading', 'On Route', 'Delayed', 'At Destination'];

  const getEtaDisplay = (eta: string | null, status: string) => {
    if (!eta) return <span className="text-muted-foreground">N/A</span>;
    if (status === 'At Destination' || status === 'Unloading') {
      return <span className="text-safe">Arrived</span>;
    }
    if (status === 'Loading') {
      return <span className="text-muted-foreground">Not started</span>;
    }
    const etaDate = new Date(eta);
    const now = new Date();
    if (etaDate < now) {
      return <span className="text-blocked">Overdue</span>;
    }
    return formatDistanceToNow(etaDate, { addSuffix: false });
  };

  const getDriverName = (driverId: string | null) => {
    if (!driverId) return 'Unassigned';
    const driver = drivers.find(d => d.id === driverId);
    return driver?.name || 'Unknown';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Live Operations</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Real-time tracking of active trips and fleet movements
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
              <span>Live updates enabled</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-border"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              {isLoading ? "Updating..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground">
          Last updated: {formatDistanceToNow(lastRefresh, { addSuffix: true })}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by vehicle or driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  activeFilter === filter 
                    ? "bg-primary text-primary-foreground" 
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-2xl font-bold text-foreground">{trips.length}</p>
            <p className="text-xs text-muted-foreground">Total Active</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-2xl font-bold text-safe">{trips.filter(t => t.status === 'On Route').length}</p>
            <p className="text-xs text-muted-foreground">On Route</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-2xl font-bold text-expiring">{trips.filter(t => t.status === 'Delayed').length}</p>
            <p className="text-xs text-muted-foreground">Delayed</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-2xl font-bold text-chart-4">{trips.filter(t => t.status === 'At Destination').length}</p>
            <p className="text-xs text-muted-foreground">At Destination</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Vehicle No</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Driver</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">Route</TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">Progress</TableHead>
                  <TableHead className="text-muted-foreground">ETA</TableHead>
                  <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-2 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredTrips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No active trips found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrips.map((trip) => (
                    <TableRow key={trip.id} className="border-border hover:bg-muted/30">
                      <TableCell>
                        <TripStatusBadge status={trip.status} />
                      </TableCell>
                      <TableCell>
                        <VehicleNumber number={trip.vehicle_no} />
                      </TableCell>
                      <TableCell className="text-foreground hidden md:table-cell">{getDriverName(trip.driver_id)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                          <span className="text-muted-foreground truncate max-w-[60px] sm:max-w-none">{trip.origin}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-foreground truncate max-w-[60px] sm:max-w-none">{trip.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="w-24">
                          <Progress value={trip.progress_percent ?? 0} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{trip.progress_percent ?? 0}%</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs sm:text-sm">
                        {getEtaDisplay(trip.eta, trip.status)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => toast.info(`Viewing details for ${trip.vehicle_no}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => toast.info(`Calling driver: ${getDriverName(trip.driver_id)}`)}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Contact Driver
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => toast.info(`Tracking ${trip.vehicle_no}`)}
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              Track Location
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
