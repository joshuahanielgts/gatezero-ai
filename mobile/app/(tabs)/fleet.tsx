// GateZero Mobile - Fleet Screen
import { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  TextInput, FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface Vehicle {
  id: string;
  number: string;
  type: string;
  status: 'active' | 'inactive' | 'flagged';
  compliance: number;
  lastVerified: string;
  driver?: string;
}

const vehicles: Vehicle[] = [
  { id: '1', number: 'MH 12 AB 1234', type: 'HGV', status: 'active', compliance: 92, lastVerified: '2 hrs ago', driver: 'Ramesh Kumar' },
  { id: '2', number: 'DL 8C 4567', type: 'LCV', status: 'flagged', compliance: 45, lastVerified: '1 day ago', driver: 'Suresh Singh' },
  { id: '3', number: 'KA 01 MN 9876', type: 'HGV', status: 'active', compliance: 88, lastVerified: '3 hrs ago', driver: 'Anil Verma' },
  { id: '4', number: 'TN 22 XY 5678', type: 'Tanker', status: 'active', compliance: 95, lastVerified: '30 min ago' },
  { id: '5', number: 'GJ 5 BC 7890', type: 'HGV', status: 'inactive', compliance: 72, lastVerified: '3 days ago' },
  { id: '6', number: 'RJ 14 CA 3456', type: 'LCV', status: 'active', compliance: 81, lastVerified: '5 hrs ago', driver: 'Mohan Patel' },
];

export default function FleetScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'flagged' | 'inactive'>('all');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.driver?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || v.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'active': return '#22C55E';
      case 'flagged': return '#EF4444';
      case 'inactive': return '#6B7280';
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 80) return '#22C55E';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <Link href={`/vehicle/${item.id}` as any} asChild>
      <TouchableOpacity style={styles.vehicleCard}>
        <View style={styles.vehicleHeader}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleNumber}>{item.number}</Text>
            <View style={styles.vehicleMeta}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
              <Text style={styles.vehicleType}>{item.type}</Text>
            </View>
          </View>
          <View style={[
            styles.complianceBadge,
            { backgroundColor: getComplianceColor(item.compliance) + '20' }
          ]}>
            <Text style={[styles.complianceText, { color: getComplianceColor(item.compliance) }]}>
              {item.compliance}%
            </Text>
          </View>
        </View>

        {item.driver && (
          <View style={styles.driverRow}>
            <Ionicons name="person" size={14} color="#6B7280" />
            <Text style={styles.driverText}>{item.driver}</Text>
          </View>
        )}

        <View style={styles.vehicleFooter}>
          <View style={styles.lastVerified}>
            <Ionicons name="time-outline" size={12} color="#6B7280" />
            <Text style={styles.lastVerifiedText}>Verified {item.lastVerified}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#374151" />
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vehicles or drivers..."
            placeholderTextColor="#4B5563"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {[
          { key: 'all', label: 'All', count: vehicles.length },
          { key: 'active', label: 'Active', count: vehicles.filter(v => v.status === 'active').length },
          { key: 'flagged', label: 'Flagged', count: vehicles.filter(v => v.status === 'flagged').length },
          { key: 'inactive', label: 'Inactive', count: vehicles.filter(v => v.status === 'inactive').length },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              activeFilter === filter.key && styles.filterTabActive
            ]}
            onPress={() => setActiveFilter(filter.key as any)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter.key && styles.filterTextActive
            ]}>
              {filter.label}
            </Text>
            <View style={[
              styles.filterBadge,
              activeFilter === filter.key && styles.filterBadgeActive
            ]}>
              <Text style={[
                styles.filterBadgeText,
                activeFilter === filter.key && styles.filterBadgeTextActive
              ]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Vehicle List */}
      <FlatList
        data={filteredVehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={48} color="#374151" />
            <Text style={styles.emptyText}>No vehicles found</Text>
          </View>
        }
      />

      {/* Add Vehicle FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111113',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#FFFFFF',
  },
  filterContainer: {
    maxHeight: 52,
    marginTop: 16,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#111113',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  filterTabActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  filterText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#22C55E',
  },
  filterBadge: {
    backgroundColor: '#1F1F23',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  filterBadgeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  filterBadgeTextActive: {
    color: '#22C55E',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  vehicleCard: {
    backgroundColor: '#111113',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  vehicleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  vehicleType: {
    fontSize: 13,
    color: '#6B7280',
  },
  complianceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  complianceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F1F23',
    gap: 8,
  },
  driverText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  vehicleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  lastVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lastVerifiedText: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
