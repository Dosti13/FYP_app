import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../common/Input';
import { StolenItemData } from '../../constants/types/report';
import { colors } from '../../constants/theme';

interface StolenItemFormProps {
  data: StolenItemData;
  itemType?: string;
  onUpdate: (data: Partial<StolenItemData>) => void;
}

export function StolenItemForm({ data, itemType, onUpdate }: StolenItemFormProps) {
  const renderPhoneFields = () => (
    <>
      <Text style={styles.sectionTitle}>Phone Details</Text>
      
      <Input
        label="IMEI Number"
        placeholder="15-digit IMEI number"
        keyboardType="numeric"
        maxLength={15}
        value={data.imei}
        onChangeText={(text) => onUpdate({ imei: text })}
      />

      <View style={styles.rowContainer}>
        <View style={[styles.halfWidth, { marginRight: 10 }]}>
          <Input
            label="Brand"
            placeholder="Samsung, iPhone, etc."
            value={data.phone_brand}
            onChangeText={(text) => onUpdate({ phone_brand: text })}
          />
        </View>

        <View style={[styles.halfWidth, { marginLeft: 10 }]}>
          <Input
            label="Model"
            placeholder="Galaxy S21, iPhone 13, etc."
            value={data.phone_model}
            onChangeText={(text) => onUpdate({ phone_model: text })}
          />
        </View>
      </View>
    </>
  );

  const renderVehicleFields = () => (
    <>
      <Text style={styles.sectionTitle}>Vehicle Details</Text>
      
      <Input
        label="License Plate Number"
        placeholder="e.g., KHI-1234"
        value={data.license_plate}
        onChangeText={(text) => onUpdate({ license_plate: text })}
      />

      <Input
        label="Chassis Number"
        placeholder="Vehicle chassis number"
        value={data.chassis_number}
        onChangeText={(text) => onUpdate({ chassis_number: text })}
      />

      <View style={styles.rowContainer}>
        <View style={[styles.halfWidth, { marginRight: 10 }]}>
          <Input
            label="Make"
            placeholder="Honda, Toyota, etc."
            value={data.vehicle_make}
            onChangeText={(text) => onUpdate({ vehicle_make: text })}
          />
        </View>

        <View style={[styles.halfWidth, { marginLeft: 10 }]}>
          <Input
            label="Model"
            placeholder="Civic 2020, Corolla, etc."
            value={data.vehicle_model}
            onChangeText={(text) => onUpdate({ vehicle_model: text })}
          />
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stolen Item Details</Text>
      <Text style={styles.subtitle}>Tell us about what was stolen</Text>

      <Input
        label="Description"
        placeholder="Describe the stolen item in detail..."
        multiline
        numberOfLines={3}
        value={data.description}
        onChangeText={(text) => onUpdate({ description: text })}
        required
      />

      <Input
        label="Estimated Value (PKR)"
        placeholder="e.g., 75000"
        keyboardType="numeric"
        value={data.value_estimate}
        onChangeText={(text) => onUpdate({ value_estimate: text })}
      />

      {itemType === 'phone' && renderPhoneFields()}
      {itemType === 'vehicle' && renderVehicleFields()}
    </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  halfWidth: {
    flex: 1,
  },
});