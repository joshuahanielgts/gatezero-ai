import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVehicles, useDrivers } from "@/hooks";
import { VehicleNumber } from "@/components/ui/mono-text";
import { StatusBadge, RiskBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { Search, Truck, User, AlertCircle } from "lucide-react";
import { format, isBefore, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function FleetGuard() {
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  
  const { vehicles, isLoading: vehiclesLoading, error: vehiclesError, toggleBlacklist } = useVehicles({ realtime: true });
  const { drivers, isLoading: driversLoading, error: driversError } = useDrivers();

  const filteredVehicles = vehicles.filter((v) =>
    v.vehicle_no.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
    v.owner_name.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
    d.license_no.toLowerCase().includes(driverSearch.toLowerCase())
  );

  const handleBlacklistToggle = async (vehicleNo: string) => {
    try {
      await toggleBlacklist(vehicleNo);
      const vehicle = vehicles.find(v => v.vehicle_no === vehicleNo);
      if (vehicle?.is_blacklisted) {
        toast.success(`Vehicle ${vehicleNo} removed from blacklist`);
      } else {
        toast.error(`Vehicle ${vehicleNo} added to blacklist`);
      }
    } catch {
      toast.error("Failed to update blacklist status");
    }
  };

  const getInsuranceStatusColor = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const warningDate = addDays(now, 30);

    if (isBefore(expiry, now)) return 'expired';
    if (isBefore(expiry, warningDate)) return 'expiring';
    return 'active';
  };

  const getLicenseStatusColor = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const warningDate = addDays(now, 60);

    if (isBefore(expiry, now)) return 'expired';
    if (isBefore(expiry, warningDate)) return 'warning';
    return 'active';
  };

  const getRiskLevel = (riskScore: number | null): 'Low' | 'Medium' | 'High' => {
    if (!riskScore) return 'Low';
    if (riskScore < 30) return 'Low';
    if (riskScore < 60) return 'Medium';
    return 'High';
  };

  const showError = vehiclesError || driversError;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fleet Guard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Vehicle and driver registry management
          </p>
        </div>

        {/* Error Alert */}
        {showError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {vehiclesError?.message || driversError?.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Truck className="w-4 h-4 mr-2" />
              Vehicles ({vehicles.length})
            </TabsTrigger>
            <TabsTrigger value="drivers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4 mr-2" />
              Drivers ({drivers.length})
            </TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                className="pl-9 bg-card border-border"
              />
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Reg No</TableHead>
                      <TableHead className="text-muted-foreground hidden sm:table-cell">Type</TableHead>
                      <TableHead className="text-muted-foreground hidden md:table-cell">Owner</TableHead>
                      <TableHead className="text-muted-foreground">Insurance</TableHead>
                      <TableHead className="text-muted-foreground hidden lg:table-cell">Risk Level</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Blacklist</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehiclesLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="border-border">
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredVehicles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No vehicles found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVehicles.map((vehicle) => {
                        const insuranceStatus = getInsuranceStatusColor(vehicle.insurance_expiry);

                        return (
                          <TableRow 
                            key={vehicle.vehicle_no} 
                            className={cn(
                              "border-border",
                              vehicle.is_blacklisted ? "bg-blocked/5 hover:bg-blocked/10" : "hover:bg-muted/30"
                            )}
                          >
                            <TableCell>
                              <VehicleNumber number={vehicle.vehicle_no} />
                            </TableCell>
                            <TableCell className="text-foreground hidden sm:table-cell">{vehicle.vehicle_type}</TableCell>
                            <TableCell className="text-foreground hidden md:table-cell">{vehicle.owner_name}</TableCell>
                            <TableCell>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className={cn(
                                  "font-mono text-xs sm:text-sm",
                                  insuranceStatus === 'expired' && "text-blocked",
                                  insuranceStatus === 'expiring' && "text-expiring",
                                  insuranceStatus === 'active' && "text-foreground"
                                )}>
                                  {format(new Date(vehicle.insurance_expiry), 'dd MMM yyyy')}
                                </span>
                                <StatusBadge status={insuranceStatus}>
                                  {insuranceStatus === 'expired' ? 'Expired' : insuranceStatus === 'expiring' ? 'Expiring' : 'Active'}
                                </StatusBadge>
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <RiskBadge level={getRiskLevel(vehicle.risk_score)} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={vehicle.is_blacklisted ? 'blocked' : 'active'}>
                                {vehicle.is_blacklisted ? 'Blacklisted' : 'Active'}
                              </StatusBadge>
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={vehicle.is_blacklisted}
                                onCheckedChange={() => handleBlacklistToggle(vehicle.vehicle_no)}
                                className="data-[state=checked]:bg-blocked"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                value={driverSearch}
                onChange={(e) => setDriverSearch(e.target.value)}
                className="pl-9 bg-card border-border"
              />
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Driver Name</TableHead>
                      <TableHead className="text-muted-foreground">License No</TableHead>
                      <TableHead className="text-muted-foreground">License Expiry</TableHead>
                      <TableHead className="text-muted-foreground">Phone</TableHead>
                      <TableHead className="text-muted-foreground">Assigned Vehicle</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {driversLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="border-border">
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredDrivers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No drivers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDrivers.map((driver) => {
                        const licenseStatus = getLicenseStatusColor(driver.license_expiry);

                        return (
                          <TableRow key={driver.id} className="border-border hover:bg-muted/30">
                            <TableCell className="text-foreground font-medium">{driver.name}</TableCell>
                            <TableCell>
                              <span className="font-mono text-sm text-muted-foreground">{driver.license_no}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "font-mono text-sm",
                                  licenseStatus === 'expired' && "text-blocked",
                                  licenseStatus === 'warning' && "text-expiring",
                                  licenseStatus === 'active' && "text-foreground"
                                )}>
                                  {format(new Date(driver.license_expiry), 'dd MMM yyyy')}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm text-foreground">{driver.phone}</span>
                            </TableCell>
                            <TableCell>
                              {driver.assigned_vehicle_no ? (
                                <VehicleNumber number={driver.assigned_vehicle_no} />
                              ) : (
                                <span className="text-muted-foreground">Unassigned</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <StatusBadge 
                                status={driver.status === 'Active' ? 'active' : driver.status === 'Inactive' ? 'inactive' : 'warning'}
                              >
                                {driver.status}
                              </StatusBadge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
