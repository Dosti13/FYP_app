import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { incidentTypes } from '../../constants/reportTypes';
import { colors } from '../../constants/theme';
import { ReportData } from '../../constants/types/report';
interface IncidentTypeSelectorProps {
  selectedType: any;
  onSelect: (type: any) => void;
  reportData: any;
  onUpdateData: (key: keyof ReportData, value: any) => void;
 }

export function IncidentTypeSelector({ 
  onSelect, 
  reportData, 
  onUpdateData 
}: IncidentTypeSelectorProps) {
  const handleSelect = (type: any) => {
    onSelect(type);
    onUpdateData('incident_type', {
      category: type.category,
      description: type.description,
    });
    onUpdateData('stolen_item', {
      ...reportData.stolen_item,
      item_type: type.itemType || '',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>What happened?</Text>
      <Text style={styles.subtitle}>Select the type of incident</Text>
      
      <View style={styles.typeGrid}>
        {incidentTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeCard,
              reportData.incident_type.category === type.category && styles.selectedTypeCard,
            ]}
            onPress={() => handleSelect(type)}
          >
            <Ionicons
              name={type.icon as any}
              size={32}
              color={reportData.incident_type.category === type.category ? '#fff' : type.color}
            />
            <Text style={[
              styles.typeLabel,
              reportData.incident_type.category === type.category && styles.selectedTypeLabel,
            ]}>
              {type.category}
            </Text>
            <Text style={[
              styles.typeDescription,
              reportData.incident_type.category === type.category && styles.selectedTypeDescription,
            ]}>
              {type.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedText,
    marginBottom: 24,
  },
  typeGrid: {
    gap: 16,
  },
  typeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedTypeCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  selectedTypeLabel: {
    color: '#fff',
  },
  typeDescription: {
    fontSize: 14,
    color: colors.mutedText,
    textAlign: 'center',
  },
  selectedTypeDescription: {
    color: '#fff',
  },
});
