// GateZero Mobile - Alerts Screen
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface Alert {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  vehicle?: string;
  time: string;
  read: boolean;
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'document_expiry',
    severity: 'critical',
    title: 'Insurance Expired',
    message: 'Vehicle insurance has expired. Immediate action required.',
    vehicle: 'MH 12 AB 1234',
    time: '15 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'compliance_violation',
    severity: 'high',
    title: 'Overloading Detected',
    message: 'Vehicle exceeded weight limit by 2.5 tons.',
    vehicle: 'DL 8C 4567',
    time: '1 hr ago',
    read: false,
  },
  {
    id: '3',
    type: 'document_expiry',
    severity: 'medium',
    title: 'Fitness Certificate Expiring',
    message: 'Certificate will expire in 7 days. Schedule inspection.',
    vehicle: 'KA 01 MN 9876',
    time: '2 hrs ago',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    severity: 'low',
    title: 'Bulk Scan Complete',
    message: '45 vehicles verified. 3 require attention.',
    time: '4 hrs ago',
    read: true,
  },
];

export default function AlertsScreen() {
  const getSeverityConfig = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return { color: '#EF4444', icon: 'alert-circle', bg: 'rgba(239, 68, 68, 0.1)' };
      case 'high':
        return { color: '#F59E0B', icon: 'warning', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'medium':
        return { color: '#3B82F6', icon: 'information-circle', bg: 'rgba(59, 130, 246, 0.1)' };
      case 'low':
        return { color: '#6B7280', icon: 'notifications', bg: 'rgba(107, 114, 128, 0.1)' };
    }
  };

  const handleAlertPress = (alert: Alert) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to alert details
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
            {alerts.filter(a => a.severity === 'critical').length}
          </Text>
          <Text style={styles.summaryLabel}>Critical</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
          <Ionicons name="warning" size={20} color="#F59E0B" />
          <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
            {alerts.filter(a => a.severity === 'high').length}
          </Text>
          <Text style={styles.summaryLabel}>High</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: 'rgba(34, 197, 94, 0.3)' }]}>
          <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
          <Text style={[styles.summaryValue, { color: '#22C55E' }]}>
            {alerts.filter(a => a.read).length}
          </Text>
          <Text style={styles.summaryLabel}>Resolved</Text>
        </View>
      </View>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unreadCount} unread alert{unreadCount > 1 ? 's' : ''}</Text>
        </View>
      )}

      {/* Alert List */}
      <View style={styles.alertList}>
        {alerts.map((alert) => {
          const config = getSeverityConfig(alert.severity);
          return (
            <TouchableOpacity
              key={alert.id}
              style={[
                styles.alertItem,
                !alert.read && { borderColor: config.color + '40' }
              ]}
              onPress={() => handleAlertPress(alert)}
              activeOpacity={0.7}
            >
              <View style={[styles.alertIcon, { backgroundColor: config.bg }]}>
                <Ionicons 
                  name={config.icon as any} 
                  size={24} 
                  color={config.color} 
                />
              </View>
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  {!alert.read && <View style={[styles.unreadDot, { backgroundColor: config.color }]} />}
                </View>
                <Text style={styles.alertMessage} numberOfLines={2}>
                  {alert.message}
                </Text>
                <View style={styles.alertMeta}>
                  {alert.vehicle && (
                    <View style={styles.alertMetaItem}>
                      <Ionicons name="car" size={12} color="#6B7280" />
                      <Text style={styles.alertMetaText}>{alert.vehicle}</Text>
                    </View>
                  )}
                  <View style={styles.alertMetaItem}>
                    <Ionicons name="time" size={12} color="#6B7280" />
                    <Text style={styles.alertMetaText}>{alert.time}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#374151" />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
    paddingHorizontal: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#111113',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  unreadBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  unreadText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  alertList: {
    gap: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111113',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertMessage: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    lineHeight: 18,
  },
  alertMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  alertMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertMetaText: {
    fontSize: 11,
    color: '#6B7280',
  },
});
