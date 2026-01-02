import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';
import { apiService } from '@/services';

interface Location {
  id: number;
  city: string;
  district: string;
  neighborhood?: string;
}

interface Alert {
  id: number;
  location: Location;
  alert_type: string;
  message: string;
  severity: string;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  created_by_username: string;
  created_at: string;
}

const AlertsPage = () => {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const alertTypes = ['all', 'high_crime', 'suspicious_activity', 'robbery', 'emergency'];
  const severityLevels = ['all', 'critical', 'high', 'medium', 'low'];

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, selectedFilter, selectedSeverity]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAlerts();
      // Sort by severity and date
      const sorted = data.sort((a, b) => {
        const severityOrder: any = { critical: 0, high: 1, medium: 2, low: 3 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setAlerts(sorted);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(alert => alert.alert_type === selectedFilter);
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }

    setFilteredAlerts(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return '#D32F2F';
      case 'high': return '#F57C00';
      case 'medium': return '#FBC02D';
      case 'low': return '#388E3C';
      default: return '#757575';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '📢';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'high_crime': return '🔴';
      case 'suspicious_activity': return '👁️';
      case 'robbery': return '💰';
      case 'emergency': return '🆘';
      default: return '📍';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatAlertType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const FilterChip = ({ label, value, isSelected, onPress }: {
    label: string;
    value: string;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isSelected && styles.filterChipActive
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterChipText,
        isSelected && styles.filterChipTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const AlertCard = ({ alert }: { alert: Alert }) => (
    <View style={[
      styles.alertCard,
      { borderLeftColor: getSeverityColor(alert.severity) }
    ]}>
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleRow}>
          <Text style={styles.alertIcon}>
            {getSeverityIcon(alert.severity)}
          </Text>
          <View style={styles.alertTitleContainer}>
            <Text style={styles.alertType}>
              {getAlertTypeIcon(alert.alert_type)} {formatAlertType(alert.alert_type)}
            </Text>
            <Text style={styles.alertTime}>{formatDate(alert.created_at)}</Text>
          </View>
        </View>
        <View style={[
          styles.severityBadge,
          { backgroundColor: getSeverityColor(alert.severity) }
        ]}>
          <Text style={styles.severityText}>{alert.severity.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.alertMessage}>{alert.message}</Text>

      <View style={styles.alertFooter}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>
            {alert.location.neighborhood && `${alert.location.neighborhood}, `}
            {alert.location.district}, {alert.location.city}
          </Text>
        </View>
        {alert.valid_until && (
          <Text style={styles.validUntil}>
            Valid until {new Date(alert.valid_until).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading alerts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Safety Alerts</Text>
          <Text style={styles.headerSubtitle}>
            Active alerts in your area
          </Text>
        </View>

        {/* Alert Type Filters */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Alert Type</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {alertTypes.map(type => (
              <FilterChip
                key={type}
                label={type === 'all' ? 'All' : formatAlertType(type)}
                value={type}
                isSelected={selectedFilter === type}
                onPress={() => setSelectedFilter(type)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Severity Filters */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Severity Level</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {severityLevels.map(severity => (
              <FilterChip
                key={severity}
                label={severity.charAt(0).toUpperCase() + severity.slice(1)}
                value={severity}
                isSelected={selectedSeverity === severity}
                onPress={() => setSelectedSeverity(severity)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Alert Count */}
        <View style={styles.countSection}>
          <Text style={styles.countText}>
            {filteredAlerts.length} {filteredAlerts.length === 1 ? 'Alert' : 'Alerts'}
          </Text>
        </View>

        {/* Alerts List */}
        <View style={styles.alertsList}>
          {filteredAlerts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>✅</Text>
              <Text style={styles.emptyStateTitle}>No Active Alerts</Text>
              <Text style={styles.emptyStateText}>
                There are no alerts matching your filters. Stay safe!
              </Text>
            </View>
          ) : (
            filteredAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Safety Alerts</Text>
          <Text style={styles.infoText}>
            Safety alerts are issued by authorities and community moderators to keep you 
            informed about potential risks in specific areas. Stay vigilant and take 
            necessary precautions when traveling through highlighted areas.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  countSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  countText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  alertsList: {
    paddingHorizontal: 16,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#999',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  validUntil: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});

export default AlertsPage;