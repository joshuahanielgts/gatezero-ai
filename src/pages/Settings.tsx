// GateZero - Settings Page
// Organization settings, API keys, and integrations

import { useState } from 'react';
import { 
  Settings, Key, Webhook, Bell, Shield, Building2,
  Copy, Eye, EyeOff, Plus, Trash2, Check, RefreshCw
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  lastUsed: string | null;
  createdAt: string;
  permissions: string[];
}

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered: string | null;
}

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API',
      prefix: 'wg_prod_***',
      lastUsed: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      permissions: ['read', 'write'],
    },
    {
      id: '2',
      name: 'Mobile App',
      prefix: 'wg_mob_***',
      lastUsed: '2024-01-15T09:15:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      permissions: ['read'],
    },
  ]);

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      url: 'https://api.example.com/webhooks/gatezero',
      events: ['scan.completed', 'alert.created'],
      active: true,
      lastTriggered: '2024-01-15T10:25:00Z',
    },
  ]);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    dailyDigest: true,
    criticalOnly: false,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const generateNewKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      prefix: `wg_new_${Math.random().toString(36).substr(2, 6)}`,
      lastUsed: null,
      createdAt: new Date().toISOString(),
      permissions: ['read'],
    };
    setApiKeys(prev => [...prev, newKey]);
    toast.success('API key generated', {
      description: 'Make sure to copy it - you won\'t see it again!',
    });
  };

  const deleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    toast.success('API key deleted');
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(w => 
      w.id === id ? { ...w, active: !w.active } : w
    ));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your organization and integrations</p>
        </div>
      </div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl h-auto">
          <TabsTrigger value="organization" className="gap-2 py-2 sm:py-1.5">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Organization</span>
            <span className="sm:hidden text-xs">Org</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2 py-2 sm:py-1.5">
            <Key className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">API Keys</span>
            <span className="sm:hidden text-xs">API</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2 py-2 sm:py-1.5">
            <Webhook className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Webhooks</span>
            <span className="sm:hidden text-xs">Hooks</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 py-2 sm:py-1.5">
            <Bell className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden text-xs">Alerts</span>
          </TabsTrigger>
        </TabsList>

        {/* Organization Settings */}
        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organization Details</CardTitle>
              <CardDescription>Manage your organization profile and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" defaultValue="ABC Logistics Pvt Ltd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgId">Organization ID</Label>
                  <div className="flex gap-2">
                    <Input id="orgId" value="org_abc123xyz" disabled className="font-mono" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard('org_abc123xyz')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" defaultValue="admin@abclogistics.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Transport Nagar, Mumbai, Maharashtra 400001" />
              </div>
              <div className="flex justify-end">
                <Button>
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subscription</CardTitle>
              <CardDescription>Your current plan and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-violet-500" />
                    <span className="font-semibold">Pro Plan</span>
                    <Badge className="bg-violet-500">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Unlimited scans • 5 team members • API access • Priority support
                  </p>
                </div>
                <Button variant="outline">Manage Subscription</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">API Keys</CardTitle>
                  <CardDescription>Manage API keys for external integrations</CardDescription>
                </div>
                <Button onClick={generateNewKey}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {showApiKey === key.id ? `wg_${key.id}_full_key_here` : key.prefix}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setShowApiKey(showApiKey === key.id ? null : key.id)}
                          >
                            {showApiKey === key.id ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(key.prefix)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {key.permissions.map((p) => (
                            <Badge key={p} variant="outline" className="text-[10px]">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {key.lastUsed 
                          ? new Date(key.lastUsed).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => deleteKey(key.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API Documentation</CardTitle>
              <CardDescription>Quick reference for GateZero API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Base URL</p>
                  <code className="text-sm">https://api.gatezero.ai/v1</code>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Authentication</p>
                  <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
                </div>
                <Button variant="outline" className="w-full">
                  View Full Documentation →
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Webhooks</CardTitle>
                  <CardDescription>Receive real-time event notifications</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div 
                    key={webhook.id}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {webhook.url}
                          </code>
                          <Badge variant={webhook.active ? 'default' : 'secondary'}>
                            {webhook.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-[10px]">
                              {event}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Last triggered: {webhook.lastTriggered 
                            ? new Date(webhook.lastTriggered).toLocaleString()
                            : 'Never'
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={webhook.active}
                          onCheckedChange={() => toggleWebhook(webhook.id)}
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Events</CardTitle>
              <CardDescription>Events you can subscribe to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { event: 'scan.completed', desc: 'When a vehicle scan completes' },
                  { event: 'scan.failed', desc: 'When a scan fails' },
                  { event: 'alert.created', desc: 'When a new alert is created' },
                  { event: 'alert.resolved', desc: 'When an alert is resolved' },
                  { event: 'document.expiring', desc: 'When a document is about to expire' },
                  { event: 'bulk.completed', desc: 'When a bulk scan finishes' },
                ].map((item) => (
                  <div key={item.event} className="p-3 rounded-lg bg-muted/50">
                    <code className="text-xs font-medium">{item.event}</code>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailAlerts">Email Alerts</Label>
                  <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch
                  id="emailAlerts"
                  checked={notifications.emailAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, emailAlerts: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Browser and mobile push notifications</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsAlerts">SMS Alerts</Label>
                  <p className="text-xs text-muted-foreground">Critical alerts via SMS (charges may apply)</p>
                </div>
                <Switch
                  id="smsAlerts"
                  checked={notifications.smsAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, smsAlerts: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dailyDigest">Daily Digest</Label>
                  <p className="text-xs text-muted-foreground">Summary email at end of day</p>
                </div>
                <Switch
                  id="dailyDigest"
                  checked={notifications.dailyDigest}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, dailyDigest: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="criticalOnly">Critical Only</Label>
                  <p className="text-xs text-muted-foreground">Only notify for critical severity alerts</p>
                </div>
                <Switch
                  id="criticalOnly"
                  checked={notifications.criticalOnly}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, criticalOnly: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alert Thresholds</CardTitle>
              <CardDescription>Configure when alerts are triggered</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDays">Document Expiry Warning</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days before</SelectItem>
                      <SelectItem value="15">15 days before</SelectItem>
                      <SelectItem value="30">30 days before</SelectItem>
                      <SelectItem value="60">60 days before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complianceThreshold">Compliance Alert Threshold</Label>
                  <Select defaultValue="70">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">Below 50%</SelectItem>
                      <SelectItem value="60">Below 60%</SelectItem>
                      <SelectItem value="70">Below 70%</SelectItem>
                      <SelectItem value="80">Below 80%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Check className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AppLayout>
  );
}
