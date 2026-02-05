import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vehicles, drivers } from "@/data/mockData";
import { VehicleNumber } from "@/components/ui/mono-text";
import { StatusBadge, RiskBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Truck, User } from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function FleetGuard() {
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [blacklistedVehicles, setBlacklistedVehicles] = useState<Set<string>>(
    new Set(vehicles.filter(v => v.isBlacklisted).map(v => v.id))
  );

  const filteredVehicles = vehicles.filter((v) =>
    v.regNo.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
    v.ownerName.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
    d.licenseNo.toLowerCase().includes(driverSearch.toLowerCase())
  );

  const handleBlacklistToggle = (vehicleId: string, regNo: string) => {
    setBlacklistedVehicles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(vehicleId)) {
        newSet.delete(vehicleId);
        toast.success(`Vehicle ${regNo} removed from blacklist`);
      } else {
        newSet.add(vehicleId);
        toast.error(`Vehicle ${regNo} added to blacklist`);
      }
      return newSet;
    });
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
                      <TableHead className="text-muted-foreground">Type</TableHead>
                      <TableHead className="text-muted-foreground">Insurance Expiry</TableHead>
                      <TableHead className="text-muted-foreground">Driver Assigned</TableHead>
                      <TableHead className="text-muted-foreground">Risk Level</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Blacklist</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => {
                      const isBlacklisted = blacklistedVehicles.has(vehicle.id);
                      const insuranceStatus = getInsuranceStatusColor(vehicle.insuranceExpiry);
                      const driver = drivers.find(d => d.id === vehicle.assignedDriver);

                      return (
                        <TableRow 
                          key={vehicle.id} 
                          className={cn(
                            "border-border",
                            isBlacklisted ? "bg-blocked/5 hover:bg-blocked/10" : "hover:bg-muted/30"
                          )}
                        >
                          <TableCell>
                            <VehicleNumber number={vehicle.regNo} />
                          </TableCell>
                          <TableCell className="text-foreground">{vehicle.type}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "font-mono text-sm",
                                insuranceStatus === 'expired' && "text-blocked",
                                insuranceStatus === 'expiring' && "text-expiring",
                                insuranceStatus === 'active' && "text-foreground"
                              )}>
                                {format(new Date(vehicle.insuranceExpiry), 'dd MMM yyyy')}
                              </span>
                              <StatusBadge status={insuranceStatus}>
                                {insuranceStatus === 'expired' ? 'Expired' : insuranceStatus === 'expiring' ? 'Expiring' : 'Active'}
                              </StatusBadge>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {driver?.name || <span className="text-muted-foreground">Unassigned</span>}
                          </TableCell>
                          <TableCell>
                            <RiskBadge level={vehicle.riskLevel} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={isBlacklisted ? 'blocked' : 'active'}>
                              {isBlacklisted ? 'Blacklisted' : 'Active'}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={isBlacklisted}
                              onCheckedChange={() => handleBlacklistToggle(vehicle.id, vehicle.regNo)}
                              className="data-[state=checked]:bg-blocked"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                    {filteredDrivers.map((driver) => {
                      const licenseStatus = getLicenseStatusColor(driver.licenseExpiry);

                      return (
                        <TableRow key={driver.id} className="border-border hover:bg-muted/30">
                          <TableCell className="text-foreground font-medium">{driver.name}</TableCell>
                          <TableCell>
                            <span className="font-mono text-sm text-muted-foreground">{driver.licenseNo}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "font-mono text-sm",
                                licenseStatus === 'expired' && "text-blocked",
                                licenseStatus === 'warning' && "text-expiring",
                                licenseStatus === 'active' && "text-foreground"
                              )}>
                                {format(new Date(driver.licenseExpiry), 'dd MMM yyyy')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm text-foreground">+91 {driver.phone}</span>
                          </TableCell>
                          <TableCell>
                            {driver.assignedVehicle ? (
                              <VehicleNumber number={driver.assignedVehicle} />
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
                    })}
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
