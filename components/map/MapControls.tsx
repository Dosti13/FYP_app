// MapControls.tsx - FLOATING CONTROL BUTTONS
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MapControlsProps } from '../../types/map';

const MapControls: React.FC<MapControlsProps> = ({
  onLocationPress,
  onFilterPress,
  onRefreshPress,
  activeFilters
}) => {
  
  // NO API CALLS IN THIS FILE - PURE UI COMPONENT
  // All actions are callbacks to parent MapScreen
  
  return (
    <View style={styles.controlsContainer}>
      {/* MY LOCATION BUTTON */}
      <TouchableOpacity style={styles.controlButton} onPress={onLocationPress}>
        <Ionicons name="locate" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* FILTER BUTTON */}
      <TouchableOpacity 
        style={[styles.controlButton, activeFilters.length > 0 && styles.activeFilter]} 
        onPress={onFilterPress}
      >
        <Ionicons name="filter" size={24} color="#FFFFFF" />
        {activeFilters.length > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{activeFilters.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* REFRESH BUTTON */}
      <TouchableOpacity style={styles.controlButton} onPress={onRefreshPress}>
        <Ionicons name="refresh" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: { position: 'absolute', top: 50, right: 15, flexDirection: 'column' },
  controlButton: { width: 50, height: 50, backgroundColor: '#3742FA', borderRadius: 25, 
                   alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  activeFilter: { backgroundColor: '#FF6B6B' },
  filterBadge: { position: 'absolute', top: -5, right: -5, width: 20, height: 20, 
                 backgroundColor: '#FF4757', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    filterBadgeText: {
    fontSize: 14,
    fontFamily: 'DMRegular',
    color: '#374151',
    marginRight: 4,
  },
});

export default MapControls;