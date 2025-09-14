import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { locationData } from '../../constants/location';
import { colors } from '../../constants/theme';

interface LocationPickerProps {
  selectedProvince: string;
  selectedCity: string;
  onProvinceChange: (province: string) => void;
  onCityChange: (city: string) => void;
}

export function LocationPicker({
  selectedProvince,
  selectedCity,
  onProvinceChange,
  onCityChange,
}: LocationPickerProps) {
  const [showCities, setShowCities] = useState(false);
  const availableCities = locationData[selectedProvince] || [];

  const handleProvinceSelect = (province: string) => {
    onProvinceChange(province);
    setShowCities(true);
  };

  const renderProvinceItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.pickerItem,
        selectedProvince === item && styles.selectedPickerItem
      ]}
      onPress={() => handleProvinceSelect(item)}
    >
      <Text style={[
        styles.pickerText,
        selectedProvince === item && styles.selectedPickerText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderCityItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.pickerItem,
        selectedCity === item && styles.selectedPickerItem
      ]}
      onPress={() => onCityChange(item)}
    >
      <Text style={[
        styles.pickerText,
        selectedCity === item && styles.selectedPickerText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Province *</Text>
        <View style={styles.pickerContainer}>
          <FlatList
            data={Object.keys(locationData)}
            renderItem={renderProvinceItem}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      {availableCities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>City *</Text>
          <View style={styles.pickerContainer}>
            <FlatList
              data={availableCities}
              renderItem={renderCityItem}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedPickerItem: {
    backgroundColor: colors.primary,
  },
  pickerText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedPickerText: {
    color: '#fff',
  },
});
