import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../../constants/theme';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface ReportCardProps {
  report: {
    id: number;
    occurred_at: string;
    location: {
      city: string;
      neighborhood: string;
      province: string;
    };
    incident_type: {
      category: string;
    };
    stolen_item?: {
      item_type: string;
      description: string;
    };
    value_estimate?: number;
    fir_filed: boolean;
  };
}

export function ReportCard({ report }: ReportCardProps) {
  const getIncidentIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mobile snatch':
        return 'phone-portrait-outline';
      case 'vehicle theft':
        return 'car-outline';
      case 'bag snatching':
        return 'bag-outline';
      case 'street robbery':
        return 'warning-outline';
      case 'harassment':
        return 'chatbubble-ellipses-outline';
      default:
        return 'alert-circle-outline';
    }
  };

  const getIncidentColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mobile snatch':
        return '#ef4444';
      case 'vehicle theft':
        return '#dc2626';
      case 'bag snatching':
        return '#f97316';
      case 'street robbery':
        return '#b91c1c';
      case 'harassment':
        return '#ea580c';
      default:
        return '#6b7280';
    }
  };

  const handlePress = () => {
    router.navigate(`/report/${report.id}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.incidentInfo}>
          <View style={[
            styles.incidentIcon, 
            { backgroundColor: getIncidentColor(report.incident_type.category) + '20' }
          ]}>
            <Ionicons 
              name={getIncidentIcon(report.incident_type.category) as any}
              size={20} 
              color={getIncidentColor(report.incident_type.category)} 
            />
          </View>
          <View style={styles.incidentDetails}>
            <Text style={styles.incidentType}>{report.incident_type.category}</Text>
            <Text style={styles.location}>
              {report.location.neighborhood}, {report.location.city}
            </Text>
          </View>
        </View>
        <Text style={styles.date}>{formatDate(report.occurred_at)}</Text>
      </View>

      {report.stolen_item && (
        <View style={styles.itemInfo}>
          <Text style={styles.itemDescription}>{report.stolen_item.description}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.statusContainer}>
          {report.fir_filed && (
            <View style={styles.firBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.success} />
              <Text style={styles.firText}>FIR Filed</Text>
            </View>
          )}
          {report.value_estimate && (
            <Text style={styles.valueEstimate}>
              Loss: {formatCurrency(report.value_estimate)}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  incidentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  incidentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incidentDetails: {
    flex: 1,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: colors.mutedText,
  },
  date: {
    fontSize: 12,
    color: colors.mutedText,
  },
  itemInfo: {
    marginBottom: 12,
  },
  itemDescription: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  firBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  firText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  valueEstimate: {
    fontSize: 12,
    color: colors.mutedText,
    fontWeight: '500',
  },
});
