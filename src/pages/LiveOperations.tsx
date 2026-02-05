import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { trips } from "@/data/mockData";
import { VehicleNumber } from "@/components/ui/mono-text";
import { TripStatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { Search, MoreVertical, Eye, Phone, MapPin } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FilterTab = 'All' | 'On Route' | 'Delayed' | 'At Destination';

export default function LiveOperations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && trip.status === activeFilter;
  });

  const filters: FilterTab[] = ['All', 'On Route', 'Delayed', 'At Destination'];

  const getEtaDisplay = (eta: string, status: string) => {
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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Operations</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time tracking of active trips and fleet movements
          </p>
        </div>

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
          
          <div className="flex gap-2">
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
                  <TableHead className="text-muted-foreground">Driver</TableHead>
                  <TableHead className="text-muted-foreground">Route</TableHead>
                  <TableHead className="text-muted-foreground">Progress</TableHead>
                  <TableHead className="text-muted-foreground">ETA</TableHead>
                  <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.map((trip) => (
                  <TableRow key={trip.id} className="border-border hover:bg-muted/30">
                    <TableCell>
                      <TripStatusBadge status={trip.status} />
                    </TableCell>
                    <TableCell>
                      <VehicleNumber number={trip.vehicleNo} />
                    </TableCell>
                    <TableCell className="text-foreground">{trip.driverName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{trip.origin}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-foreground">{trip.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress value={trip.progressPercent} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{trip.progressPercent}%</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
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
                            onClick={() => toast.info(`Viewing details for ${trip.vehicleNo}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => toast.info(`Calling driver: ${trip.driverName}`)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Contact Driver
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => toast.info(`Tracking ${trip.vehicleNo}`)}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Track Location
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredTrips.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No trips found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
