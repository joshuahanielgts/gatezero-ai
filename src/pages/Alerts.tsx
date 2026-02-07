// GateZero - Alerts Page
// Real-time compliance alerts dashboard

import { useState, useEffect } from 'react';
import { Bell, Settings, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertCenter } from '@/components/alerts/AlertCenter';
import { AppLayout } from '@/components/layout/AppLayout';
import type { Alert } from '@/types/premium.types';

// Mock alerts for demonstration
const generateMockAlerts = (): Alert[] => {
  const alerts: Alert[] = [
    {
      id: '1',
      organization_id: 'org-1',
      type: 'document_expiry',
      severity: 'critical',
      title: 'Insurance Expired - MH 12 AB 1234',
      message: 'Vehicle insurance has expired. Immediate action required to avoid penalties.',
      entity_type: 'vehicle',
      entity_id: 'MH 12 AB 1234',
      status: 'active',
      metadata: {},
      acknowledged_by: null,
      acknowledged_at: null,
      resolved_by: null,
      resolved_at: null,
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      organization_id: 'org-1',
      type: 'compliance_violation',
      severity: 'high',
      title: 'Overloading Detected - DL 8C 4567',
      message: 'Vehicle exceeded weight limit by 2.5 tons at Toll Plaza NH-48.',
      entity_type: 'vehicle',
      entity_id: 'DL 8C 4567',
      status: 'active',
      metadata: {},
      acknowledged_by: null,
      acknowledged_at: null,
      resolved_by: null,
      resolved_at: null,
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      organization_id: 'org-1',
      type: 'document_expiry',
      severity: 'medium',
      title: 'Fitness Certificate Expiring - KA 01 MN 9876',
      message: 'Fitness certificate will expire in 7 days. Schedule inspection soon.',
      entity_type: 'vehicle',
      entity_id: 'KA 01 MN 9876',
      status: 'acknowledged',
      metadata: {},
      acknowledged_by: 'user-1',
      acknowledged_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      resolved_by: null,
      resolved_at: null,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      organization_id: 'org-1',
      type: 'driver_violation',
      severity: 'high',
      title: 'License Suspended - Ramesh Kumar',
      message: 'Driver license has been suspended due to traffic violations.',
      entity_type: 'driver',
      entity_id: 'DRV-2345',
      status: 'active',
      metadata: {},
      acknowledged_by: null,
      acknowledged_at: null,
      resolved_by: null,
      resolved_at: null,
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      organization_id: 'org-1',
      type: 'geofence_breach',
      severity: 'medium',
      title: 'Route Deviation - TN 22 XY 5678',
      message: 'Vehicle deviated from designated route near Chennai bypass.',
      entity_type: 'vehicle',
      entity_id: 'TN 22 XY 5678',
      status: 'resolved',
      metadata: {},
      acknowledged_by: null,
      acknowledged_at: null,
      resolved_by: 'user-2',
      resolved_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      organization_id: 'org-1',
      type: 'document_expiry',
      severity: 'low',
      title: 'PUC Expiring - RJ 14 CA 3456',
      message: 'Pollution certificate will expire in 15 days.',
      entity_type: 'vehicle',
      entity_id: 'RJ 14 CA 3456',
      status: 'active',
      metadata: {},
      acknowledged_by: null,
      acknowledged_at: null,
      resolved_by: null,
      resolved_at: null,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '7',
      organization_id: 'org-1',
      type: 'compliance_violation',
      severity: 'critical',
      title: 'Permit Violation - GJ 5 BC 7890',
      message: 'Vehicle operating outside permitted zone. Fine applicable.',
      entity_type: 'vehicle',
      entity_id: 'GJ 5 BC 7890',
      status: 'active',
      metadata: {},
      acknowledged_by: null,
      acknowledged_at: null,
      resolved_by: null,
      resolved_at: null,
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: '8',
      organization_id: 'org-1',
      type: 'system_alert',
      severity: 'low',
      title: 'Bulk Verification Completed',
      message: '45 vehicles verified successfully. 3 require attention.',
      entity_type: 'fleet',
      entity_id: 'BATCH-789',
      status: 'dismissed',
      metadata: {},
      acknowledged_by: null,
      acknowledged_at: null,
      resolved_by: null,
      resolved_at: null,
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return alerts;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading alerts
    const timer = setTimeout(() => {
      setAlerts(generateMockAlerts());
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id 
        ? { 
            ...alert, 
            status: 'acknowledged' as const,
            acknowledged_at: new Date().toISOString(),
            acknowledged_by: 'current-user',
          }
        : alert
    ));
  };

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id 
        ? { 
            ...alert, 
            status: 'resolved' as const,
            resolved_at: new Date().toISOString(),
            resolved_by: 'current-user',
          }
        : alert
    ));
  };

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id 
        ? { ...alert, status: 'dismissed' as const }
        : alert
    ));
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAlerts(generateMockAlerts());
      setIsLoading(false);
    }, 500);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Alerts</h1>
            <p className="text-sm text-muted-foreground">Monitor compliance alerts in real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Alert Center */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <AlertCenter 
          alerts={alerts}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
          onDismiss={handleDismiss}
        />
      )}
      </div>
    </AppLayout>
  );
}
