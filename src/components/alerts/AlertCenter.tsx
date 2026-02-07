// GateZero - Alert Center Component
// Real-time compliance alerts with filtering and actions

import { useState } from 'react';
import { 
  AlertTriangle, Bell, Check, X, Clock, Filter,
  ChevronDown, Shield, Truck, User, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Alert, AlertSeverity, AlertStatus } from '@/types/premium.types';

interface AlertCenterProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
}

const severityConfig: Record<AlertSeverity, { color: string; bg: string; icon: React.ReactNode }> = {
  critical: { 
    color: 'text-red-500', 
    bg: 'bg-red-500/10 border-red-500/20',
    icon: <AlertTriangle className="w-4 h-4" />
  },
  high: { 
    color: 'text-orange-500', 
    bg: 'bg-orange-500/10 border-orange-500/20',
    icon: <AlertTriangle className="w-4 h-4" />
  },
  medium: { 
    color: 'text-yellow-500', 
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    icon: <Bell className="w-4 h-4" />
  },
  low: { 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10 border-blue-500/20',
    icon: <Bell className="w-4 h-4" />
  },
};

const statusConfig: Record<AlertStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-red-500' },
  acknowledged: { label: 'Acknowledged', color: 'bg-yellow-500' },
  resolved: { label: 'Resolved', color: 'bg-green-500' },
  dismissed: { label: 'Dismissed', color: 'bg-gray-500' },
};

const entityIcons: Record<string, React.ReactNode> = {
  vehicle: <Truck className="w-3 h-3" />,
  driver: <User className="w-3 h-3" />,
  document: <FileText className="w-3 h-3" />,
  fleet: <Shield className="w-3 h-3" />,
};

export function AlertCenter({ alerts, onAcknowledge, onResolve, onDismiss }: AlertCenterProps) {
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false;
    return true;
  });

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-500">{criticalCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-orange-500">{activeCount}</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Acknowledged</p>
                <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'acknowledged').length}</p>
              </div>
              <Clock className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-500">{alerts.filter(a => a.status === 'resolved').length}</p>
              </div>
              <Check className="w-8 h-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="w-3 h-3 mr-2" />
              Severity: {severityFilter === 'all' ? 'All' : severityFilter}
              <ChevronDown className="w-3 h-3 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSeverityFilter('all')}>All</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSeverityFilter('critical')}>Critical</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter('high')}>High</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter('medium')}>Medium</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter('low')}>Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="w-3 h-3 mr-2" />
              Status: {statusFilter === 'all' ? 'All' : statusFilter}
              <ChevronDown className="w-3 h-3 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('acknowledged')}>Acknowledged</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('resolved')}>Resolved</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('dismissed')}>Dismissed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Alert List */}
      <div className="space-y-2">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">No alerts match your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map(alert => {
            const severity = severityConfig[alert.severity];
            const status = statusConfig[alert.status];

            return (
              <Card 
                key={alert.id} 
                className={cn(
                  'transition-all hover:shadow-md',
                  alert.status === 'active' && severity.bg
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Severity Icon */}
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                      severity.bg
                    )}>
                      <span className={severity.color}>{severity.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-sm">{alert.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn('shrink-0 text-[10px]', severity.color)}
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        {alert.entity_type && (
                          <span className="flex items-center gap-1">
                            {entityIcons[alert.entity_type] || <Shield className="w-3 h-3" />}
                            {alert.entity_id}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(alert.created_at)}
                        </span>
                        <span className={cn(
                          'flex items-center gap-1 px-1.5 py-0.5 rounded-full',
                          status.color + '/20'
                        )}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', status.color)} />
                          {status.label}
                        </span>
                      </div>

                      {/* Actions */}
                      {alert.status === 'active' && (
                        <div className="flex items-center gap-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => onAcknowledge(alert.id)}
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            Acknowledge
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 text-xs text-green-600"
                            onClick={() => onResolve(alert.id)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Resolve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-7 text-xs text-muted-foreground"
                            onClick={() => onDismiss(alert.id)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
