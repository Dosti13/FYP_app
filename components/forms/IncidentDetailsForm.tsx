import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../common/Input';
import { IncidentData, VictimData } from '../../constants/types/report';
import { colors } from '../../constants/theme';

interface IncidentDetailsFormProps {
  incidentData: IncidentData;
  victimData: VictimData;
  onUpdateIncident: (data: Partial<IncidentData>) => void;
  onUpdateVictim: (data: Partial<VictimData>) => void;
}

export function IncidentDetailsForm({
  incidentData,
  victimData,
  onUpdateIncident,
  onUpdateVictim,
}: IncidentDetailsFormProps) {
  const genderOptions = ['Male', 'Female', 'Other'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Incident Details</Text>
      <Text style={styles.subtitle}>When did this happen?</Text>

      <Input
        label="Date & Time of Incident"
        placeholder="YYYY-MM-DD HH:MM (e.g., 2024-03-15 14:30)"
        value={incidentData.occurred_at}
        onChangeText={(text) => onUpdateIncident({ occurred_at: text })}
        required
      />

      <Input
        label="Estimated Total Loss (PKR)"
        placeholder="e.g., 50000"
        keyboardType="numeric"
        value={incidentData.value_estimate}
        onChangeText={(text) => onUpdateIncident({ value_estimate: text })}
      />

      <TouchableOpacity
        style={[styles.checkboxContainer, incidentData.fir_filed && styles.checkedContainer]}
        onPress={() => onUpdateIncident({ fir_filed: !incidentData.fir_filed })}
      >
        <Ionicons
          name={incidentData.fir_filed ? "checkbox" : "checkbox-outline"}
          size={24}
          color={incidentData.fir_filed ? colors.primary : colors.mutedText}
        />
        <Text style={styles.checkboxLabel}>FIR filed with police</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Victim Information (Optional)</Text>
      <Text style={styles.sectionSubtitle}>
        This information is optional and will be kept confidential
      </Text>

      <Input
        label="Full Name"
        placeholder="Optional"
        value={victimData.name}
        onChangeText={(text) => onUpdateVictim({ name: text })}
      />

      <View style={styles.rowContainer}>
        <View style={[styles.halfWidth, { marginRight: 10 }]}>
          <Input
            label="Age"
            placeholder="25"
            keyboardType="numeric"
            value={victimData.age}
            onChangeText={(text) => onUpdateVictim({ age: text })}
          />
        </View>

        <View style={[styles.halfWidth, { marginLeft: 10 }]}>
          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.genderContainer}>
            {genderOptions.map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderOption,
                  victimData.gender === gender && styles.selectedGenderOption
                ]}
                onPress={() => onUpdateVictim({ gender })}
              >
                <Text style={[
                  styles.genderText,
                  victimData.gender === gender && styles.selectedGenderText
                ]}>
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <Input
        label="Phone Number"
        placeholder="+92-300-1234567"
        keyboardType="phone-pad"
        value={victimData.phone_number}
        onChangeText={(text) => onUpdateVictim({ phone_number: text })}
      />

      <Input
        label="Email"
        placeholder="example@email.com"
        keyboardType="email-address"
        value={victimData.email}
        onChangeText={(text) => onUpdateVictim({ email: text })}
      />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.mutedText,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  checkedContainer: {},
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  halfWidth: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedGenderOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedGenderText: {
    color: '#fff',
  },
});