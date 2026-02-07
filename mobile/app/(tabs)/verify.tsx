// GateZero Mobile - Verify Screen
import { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';

type ScanResult = {
  status: 'pass' | 'warning' | 'fail';
  score: number;
  vehicle: {
    number: string;
    type: string;
    owner: string;
  };
  documents: {
    name: string;
    status: 'valid' | 'expiring' | 'expired';
    expiry?: string;
  }[];
  issues: string[];
} | null;

export default function VerifyScreen() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult>(null);

  const handleVerify = async () => {
    if (!vehicleNumber.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock result
    const mockResult: ScanResult = {
      status: Math.random() > 0.3 ? 'pass' : 'warning',
      score: Math.floor(60 + Math.random() * 40),
      vehicle: {
        number: vehicleNumber.toUpperCase(),
        type: 'Heavy Goods Vehicle',
        owner: 'ABC Logistics Pvt Ltd',
      },
      documents: [
        { name: 'Registration (RC)', status: 'valid', expiry: '2027-05-15' },
        { name: 'Insurance', status: Math.random() > 0.5 ? 'valid' : 'expiring', expiry: '2024-02-28' },
        { name: 'Fitness Certificate', status: 'valid', expiry: '2024-08-20' },
        { name: 'Road Tax', status: 'valid', expiry: '2025-03-31' },
        { name: 'Permit', status: Math.random() > 0.7 ? 'valid' : 'expired', expiry: '2024-01-15' },
        { name: 'PUC', status: 'valid', expiry: '2024-06-30' },
      ],
      issues: Math.random() > 0.5 ? [] : ['Insurance expiring in 15 days', 'Permit renewal required'],
    };

    setResult(mockResult);
    setIsLoading(false);

    if (mockResult.status === 'pass') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const resetScan = () => {
    setResult(null);
    setVehicleNumber('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
      case 'valid':
        return '#22C55E';
      case 'warning':
      case 'expiring':
        return '#F59E0B';
      case 'fail':
      case 'expired':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!result ? (
          <>
            {/* Input Section */}
            <View style={styles.inputSection}>
              <View style={styles.iconContainer}>
                <Ionicons name="shield-checkmark" size={48} color="#22C55E" />
              </View>
              <Text style={styles.title}>Verify Vehicle</Text>
              <Text style={styles.subtitle}>
                Enter vehicle registration number to check compliance
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons name="car" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="MH 12 AB 1234"
                  placeholderTextColor="#4B5563"
                  value={vehicleNumber}
                  onChangeText={setVehicleNumber}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                {vehicleNumber.length > 0 && (
                  <TouchableOpacity onPress={() => setVehicleNumber('')}>
                    <Ionicons name="close-circle" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={[styles.verifyButton, !vehicleNumber.trim() && styles.verifyButtonDisabled]}
                onPress={handleVerify}
                disabled={!vehicleNumber.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="search" size={20} color="#FFFFFF" />
                    <Text style={styles.verifyButtonText}>Verify Now</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Quick Scan Options */}
            <View style={styles.quickOptions}>
              <Link href="/scan" asChild>
                <TouchableOpacity style={styles.quickOption}>
                  <View style={[styles.quickOptionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                    <Ionicons name="camera" size={24} color="#3B82F6" />
                  </View>
                  <Text style={styles.quickOptionText}>Scan with Camera</Text>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
              </Link>
              <TouchableOpacity style={styles.quickOption}>
                <View style={[styles.quickOptionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                  <Ionicons name="qr-code" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.quickOptionText}>Scan QR Code</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Result Section */}
            <View style={[
              styles.resultHeader,
              { borderColor: getStatusColor(result.status) + '40' }
            ]}>
              <View style={[
                styles.resultIcon,
                { backgroundColor: getStatusColor(result.status) + '20' }
              ]}>
                <Ionicons 
                  name={result.status === 'pass' ? 'checkmark-circle' : 'warning'} 
                  size={48} 
                  color={getStatusColor(result.status)} 
                />
              </View>
              <Text style={styles.vehicleNumber}>{result.vehicle.number}</Text>
              <Text style={styles.vehicleType}>{result.vehicle.type}</Text>
              <View style={[
                styles.scoreBadge,
                { backgroundColor: getStatusColor(result.status) + '20' }
              ]}>
                <Text style={[styles.scoreText, { color: getStatusColor(result.status) }]}>
                  Compliance Score: {result.score}%
                </Text>
              </View>
            </View>

            {/* Documents */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Document Status</Text>
              {result.documents.map((doc, index) => (
                <View key={index} style={styles.docItem}>
                  <View style={styles.docInfo}>
                    <Ionicons 
                      name={doc.status === 'valid' ? 'checkmark-circle' : doc.status === 'expiring' ? 'time' : 'close-circle'}
                      size={20}
                      color={getStatusColor(doc.status)}
                    />
                    <Text style={styles.docName}>{doc.name}</Text>
                  </View>
                  <View style={[
                    styles.docStatus,
                    { backgroundColor: getStatusColor(doc.status) + '20' }
                  ]}>
                    <Text style={[styles.docStatusText, { color: getStatusColor(doc.status) }]}>
                      {doc.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Issues */}
            {result.issues.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>⚠️ Issues Found</Text>
                {result.issues.map((issue, index) => (
                  <View key={index} style={styles.issueItem}>
                    <Ionicons name="alert-circle" size={16} color="#F59E0B" />
                    <Text style={styles.issueText}>{issue}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={resetScan}>
                <Ionicons name="refresh" size={20} color="#22C55E" />
                <Text style={styles.secondaryButtonText}>New Scan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton}>
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Share Report</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  inputSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111113',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F1F23',
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22C55E',
    borderRadius: 14,
    height: 56,
    width: '100%',
    gap: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: '#374151',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quickOptions: {
    marginTop: 40,
  },
  quickOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111113',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  quickOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultHeader: {
    alignItems: 'center',
    backgroundColor: '#111113',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#111113',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F1F23',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F23',
  },
  docInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  docName: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  docStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  docStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  issueText: {
    fontSize: 14,
    color: '#F59E0B',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 14,
    height: 52,
    borderWidth: 1,
    borderColor: '#22C55E',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22C55E',
    borderRadius: 14,
    height: 52,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
