import { Button } from '@/components/common/Button';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated
} from 'react-native';
import { apiService } from '@/services';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Theme colors matching your app's green design
const COLORS = {
  primary: '#6ABD45',
  primaryDark: '#5AA538',
  primaryLight: '#E8F5E0',
  success: '#6ABD45',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  borderActive: '#6ABD45',
};

interface IMEICheckResult {
  found: boolean;
  status?: string;
  phone_brand?: string;
  phone_model?: string;
  reported_at?: string;
  message: string;
}

const IMEICheckPage = () => {
  const router = useRouter();
  const [imei, setImei] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IMEICheckResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  const validateIMEI = (imeiNumber: string): boolean => {
    const cleanIMEI = imeiNumber.replace(/[\s-]/g, '');
    
    if (cleanIMEI.length !== 15) {
      return false;
    }
    
    if (!/^\d+$/.test(cleanIMEI)) {
      return false;
    }
    
    return true;
  };

  const formatIMEI = (text: string): string => {
    const digits = text.replace(/\D/g, '');
    const limited = digits.slice(0, 15);
    
    const parts = [];
    for (let i = 0; i < limited.length; i += 3) {
      parts.push(limited.slice(i, i + 3));
    }
    
    return parts.join('-');
  };

  const handleIMEIChange = (text: string) => {
    const formatted = formatIMEI(text);
    setImei(formatted);
    
    if (showResult) {
      setShowResult(false);
      setResult(null);
    }
  };

  const handleCheckIMEI = async () => {
    Keyboard.dismiss();
    
    const cleanIMEI = imei.replace(/[\s-]/g, '');
    
    if (!validateIMEI(imei)) {
      Alert.alert(
        'Invalid IMEI',
        'Please enter a valid 15-digit IMEI number.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.checkIMEI(cleanIMEI);
      setResult(response);
      setShowResult(true);
      
      // Animate result appearance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start();
    } catch (error: any) {
      console.error('IMEI check error:', error);
      Alert.alert(
        'Error',
        'Failed to check IMEI. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStolen = () => {
    router.push('/imei/register');
  };

  const handleClear = () => {
    setImei('');
    setResult(null);
    setShowResult(false);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const ResultCard = () => {
    if (!result || !showResult) return null;

    return (
      <Animated.View 
        style={{ 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
        {result.found ? (
          // Device Found - Stolen
          <View style={[styles.resultCard, styles.resultCardDanger]}>
            <View style={styles.resultHeader}>
              <View style={styles.dangerIconContainer}>
                <Ionicons name="alert-circle" size={56} color={COLORS.danger} />
              </View>
              <Text style={styles.resultTitle}>Device Found!</Text>
              <Text style={styles.resultSubtitle}>This device has been reported as stolen</Text>
            </View>

            <View style={styles.detailsContainer}>
              {result.status && (
                <View style={styles.detailItem}>
                  <View style={styles.detailIconBox}>
                    <Ionicons name="warning-outline" size={22} color={COLORS.danger} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusText}>{result.status.toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
              )}

              {result.phone_brand && (
                <View style={styles.detailItem}>
                  <View style={styles.detailIconBox}>
                    <Ionicons name="phone-portrait-outline" size={22} color={COLORS.textSecondary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Brand</Text>
                    <Text style={styles.detailValue}>{result.phone_brand}</Text>
                  </View>
                </View>
              )}

              {result.phone_model && (
                <View style={styles.detailItem}>
                  <View style={styles.detailIconBox}>
                    <Ionicons name="information-circle-outline" size={22} color={COLORS.textSecondary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Model</Text>
                    <Text style={styles.detailValue}>{result.phone_model}</Text>
                  </View>
                </View>
              )}

              {result.reported_at && (
                <View style={styles.detailItem}>
                  <View style={styles.detailIconBox}>
                    <Ionicons name="calendar-outline" size={22} color={COLORS.textSecondary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Reported Date</Text>
                    <Text style={styles.detailValue}>{formatDate(result.reported_at)}</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.warningBox}>
              <View style={styles.warningIconContainer}>
                <Ionicons name="shield-half-outline" size={28} color={COLORS.danger} />
              </View>
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>⚠️ Do Not Purchase</Text>
                <Text style={styles.warningText}>
                  This device has been reported as stolen. Do not proceed with any transaction. 
                  If you have information about this device, contact local authorities immediately.
                </Text>
              </View>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={styles.dangerButton}
                onPress={() => {/* Report functionality */}}
              >
                <Ionicons name="flag-outline" size={20} color="#FFFFFF" />
                <Text style={styles.dangerButtonText}>Report Information</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.outlineButton}
                onPress={handleClear}
              >
                <Text style={styles.outlineButtonText}>Check Another</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Device Not Found - Clean
          <View style={[styles.resultCard, styles.resultCardSuccess]}>
            <View style={styles.resultHeader}>
              <View style={styles.successIconContainer}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark" size={48} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.resultTitle}>All Clear! ✓</Text>
              <Text style={styles.resultSubtitle}>This device is not in our stolen database</Text>
            </View>

            <View style={styles.successMessageBox}>
              <View style={styles.successBadge}>
                <Ionicons name="shield-checkmark" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.successMessageText}>
                Great news! This IMEI number has not been reported as stolen in our system.
              </Text>
            </View>

            <View style={styles.tipsContainer}>
              <View style={styles.tipsHeader}>
                <Ionicons name="bulb-outline" size={22} color={COLORS.warning} />
                <Text style={styles.tipsHeaderText}>Safety Tips Before Purchase</Text>
              </View>
              
              <View style={styles.tipItem}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>
                  Verify seller's identity and request official receipts
                </Text>
              </View>

              <View style={styles.tipItem}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>
                  Test all device functions before completing purchase
                </Text>
              </View>

              <View style={styles.tipItem}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>
                  Check for activation locks (Find My iPhone, Google FRP)
                </Text>
              </View>

              <View style={styles.tipItem}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>
                  Meet in safe, public locations for all transactions
                </Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.info} />
              <Text style={styles.infoBoxText}>
                Our database may not include all stolen devices. Always exercise caution 
                when purchasing used electronics.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.outlineButton}
              onPress={handleClear}
            >
              <Text style={styles.outlineButtonText}>Check Another IMEI</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    );
  };

  const HowToSection = () => (
    <View style={styles.howToSection}>
      <View style={styles.sectionHeader}>
        <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>How to Find Your IMEI</Text>
      </View>
      
      <View style={styles.methodsList}>
        <View style={styles.methodItem}>
          <View style={styles.methodBadge}>
            <Ionicons name="keypad-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.methodContent}>
            <View style={styles.methodTitleRow}>
              <Text style={styles.methodTitle}>Dial Code</Text>
              <View style={styles.fastTag}>
                <Text style={styles.fastTagText}>Fastest</Text>
              </View>
            </View>
            <Text style={styles.methodDescription}>
              Dial <Text style={styles.codeText}>*#06#</Text> on your phone keypad
            </Text>
          </View>
        </View>

        <View style={styles.methodItem}>
          <View style={styles.methodBadge}>
            <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.methodContent}>
            <Text style={styles.methodTitle}>Device Settings</Text>
            <Text style={styles.methodDescription}>
              <Text style={styles.boldText}>Android:</Text> Settings → About Phone → Status{'\n'}
              <Text style={styles.boldText}>iPhone:</Text> Settings → General → About
            </Text>
          </View>
        </View>

        <View style={styles.methodItem}>
          <View style={styles.methodBadge}>
            <Ionicons name="cube-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.methodContent}>
            <Text style={styles.methodTitle}>Physical Location</Text>
            <Text style={styles.methodDescription}>
              Check device back, SIM tray, or original box label
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>IMEI Checker</Text>
            <Text style={styles.headerSubtitle}>
              Verify device status before purchasing
            </Text>
          </View>

          {/* Input Card */}
          <View style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="search" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.inputHeaderText}>
                <Text style={styles.inputLabel}>Enter IMEI Number</Text>
                <Text style={styles.inputHint}>15-digit identification number</Text>
              </View>
            </View>
            
            <TextInput
              style={[
                styles.input,
                imei.length > 0 && styles.inputActive
              ]}
              placeholder="000-000-000-000-000"
              placeholderTextColor="#9CA3AF"
              value={imei}
              onChangeText={handleIMEIChange}
              keyboardType="number-pad"
              maxLength={19}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            {imei.length > 0 && (
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { width: `${(imei.replace(/[\s-]/g, '').length / 15) * 100}%` }
                  ]} 
                />
              </View>
            )}

            <View style={styles.inputActions}>
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  (loading || imei.replace(/[\s-]/g, '').length !== 15) && styles.checkButtonDisabled
                ]}
                onPress={handleCheckIMEI}
                disabled={loading || imei.replace(/[\s-]/g, '').length !== 15}
              >
                {loading ? (
                  <>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.checkButtonText}>Checking...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="search" size={20} color="#FFFFFF" />
                    <Text style={styles.checkButtonText}>Check Status</Text>
                  </>
                )}
              </TouchableOpacity>

              {imei.length > 0 && !loading && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={handleClear}
                >
                  <Ionicons name="close-circle" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Result Card */}
          <ResultCard />

          {/* Register Stolen Device */}
       
          {/* How To Section */}
          {!showResult && <HowToSection />}

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.warning} />
            <Text style={styles.disclaimerText}>
              This database is community-maintained. Results should be used as guidance only. 
              Always verify device authenticity and report suspicious activity to authorities.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  
  // Header
  header: {
    backgroundColor: COLORS.card,
    padding: 20,
    paddingTop: 10,
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 16,
    width: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  // Input Card
  inputCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  inputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputHeaderText: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  inputHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  inputActive: {
    borderColor: COLORS.borderActive,
    backgroundColor: COLORS.primaryLight,
  },
  progressContainer: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  inputActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  checkButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  checkButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Result Card
  resultCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    padding: 24,
    backgroundColor: COLORS.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  resultCardSuccess: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  resultCardDanger: {
    borderWidth: 2,
    borderColor: COLORS.danger,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dangerIconContainer: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Details Container
  detailsContainer: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 14,
  },
  detailIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.danger,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Warning Box
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  warningIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 6,
  },
  warningText: {
    fontSize: 14,
    color: '#991B1B',
    lineHeight: 20,
  },

  // Success Message Box
  successMessageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    gap: 14,
  },
  successBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successMessageText: {
    flex: 1,
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
    fontWeight: '500',
  },

  // Tips Container
  tipsContainer: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  tipsHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#78350F',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.warning,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },

  // Action Buttons
  actionButtonsContainer: {
    gap: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.danger,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  outlineButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },

  // Register Card
  registerCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  registerIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  registerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  registerDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  registerButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.danger,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // How To Section
  howToSection: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  methodsList: {
    gap: 16,
  },
  methodItem: {
    flexDirection: 'row',
    gap: 14,
  },
  methodBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodContent: {
    flex: 1,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  fastTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fastTagText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
  },
  methodDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  boldText: {
    fontWeight: '600',
    color: COLORS.text,
  },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
});

export default IMEICheckPage;