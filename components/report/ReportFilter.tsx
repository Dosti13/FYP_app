import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../common/Button';
import { incidentTypes } from '../../constants/reportTypes';
import { colors } from '../../constants/theme';

interface ReportFilterProps {
  onFiltersChange: (filters: any) => void;
}

export function ReportFilter({ onFiltersChange }: ReportFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    province: '',
    city: '',
    incident_type: '',
    date_from: '',
    date_to: '',
  });

  const handleApplyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    onFiltersChange(activeFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      province: '',
      city: '',
      incident_type: '',
      date_from: '',
      date_to: '',
    };
    setFilters(resetFilters);
    onFiltersChange({});
  };

  const activeFilterCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <>
      <TouchableOpacity
        style={[styles.filterButton, activeFilterCount > 0 && styles.activeFilterButton]}
        onPress={() => setShowFilters(true)}
      >
        <Ionicons name="filter" size={16} color={activeFilterCount > 0 ? '#fff' : colors.primary} />
        <Text style={[
          styles.filterButtonText,
          activeFilterCount > 0 && styles.activeFilterButtonText
        ]}>
          Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filter Reports</Text>
            <TouchableOpacity onPress={handleResetFilters}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Location</Text>
          

            <Text style={styles.sectionTitle}>Incident Type</Text>
            <View style={styles.incidentTypeGrid}>
              
                 
            </View>
          </View>

          <View style={styles.modalActions}>
            <Button
              title="Apply Filters"
              onPress={handleApplyFilters}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 6,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  resetText: {
    fontSize: 16,
    color: colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 20,
  },
  incidentTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  incidentTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  selectedIncidentType: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  incidentTypeText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  selectedIncidentTypeText: {
    color: '#fff',
  },
  modalActions: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

// Merge styles
