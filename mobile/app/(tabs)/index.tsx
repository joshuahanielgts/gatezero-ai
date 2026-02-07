// GateZero Mobile - Dashboard Screen
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradient: string[];
}

function StatCard({ title, value, subtitle, icon, color, gradient }: StatCardProps) {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statCard}
    >
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </LinearGradient>
  );
}

interface QuickActionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: string;
  color: string;
}

function QuickAction({ title, icon, href, color }: QuickActionProps) {
  return (
    <Link href={href as any} asChild>
      <TouchableOpacity style={styles.quickAction}>
        <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.quickActionText}>{title}</Text>
      </TouchableOpacity>
    </Link>
  );
}

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.title}>GateZero</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Compliance"
          value="87%"
          subtitle="↑ 2.5% from yesterday"
          icon="shield-checkmark"
          color="#22C55E"
          gradient={['rgba(34, 197, 94, 0.1)', 'rgba(34, 197, 94, 0.05)']}
        />
        <StatCard
          title="Scans Today"
          value="156"
          subtitle="32 pending review"
          icon="scan"
          color="#3B82F6"
          gradient={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
        />
        <StatCard
          title="Active Alerts"
          value="3"
          subtitle="1 critical"
          icon="warning"
          color="#EF4444"
          gradient={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
        />
        <StatCard
          title="Fleet Health"
          value="94%"
          subtitle="1,248 vehicles"
          icon="car"
          color="#8B5CF6"
          gradient={['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.05)']}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            title="Scan Vehicle"
            icon="camera"
            href="/scan"
            color="#22C55E"
          />
          <QuickAction
            title="Verify Driver"
            icon="person-circle"
            href="/verify"
            color="#3B82F6"
          />
          <QuickAction
            title="Calculate Fine"
            icon="calculator"
            href="/tools"
            color="#F59E0B"
          />
          <QuickAction
            title="View Reports"
            icon="stats-chart"
            href="/reports"
            color="#8B5CF6"
          />
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {[
          { vehicle: 'MH 12 AB 1234', status: 'pass', time: '2 min ago', score: 92 },
          { vehicle: 'DL 8C 4567', status: 'warning', time: '15 min ago', score: 68 },
          { vehicle: 'KA 01 MN 9876', status: 'pass', time: '32 min ago', score: 85 },
        ].map((scan, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={[
              styles.activityIndicator,
              { backgroundColor: scan.status === 'pass' ? '#22C55E' : '#F59E0B' }
            ]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityVehicle}>{scan.vehicle}</Text>
              <Text style={styles.activityTime}>{scan.time}</Text>
            </View>
            <View style={[
              styles.scoreChip,
              { backgroundColor: scan.score >= 80 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)' }
            ]}>
              <Text style={[
                styles.scoreText,
                { color: scan.score >= 80 ? '#22C55E' : '#F59E0B' }
              ]}>
                {scan.score}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Spacer for tab bar */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    width: (width - 44) / 2,
    marginHorizontal: 6,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 11,
    color: '#6B7280',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  quickAction: {
    width: (width - 44) / 2,
    marginHorizontal: 6,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#111113',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F1F23',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111113',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  activityIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityVehicle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  scoreChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
