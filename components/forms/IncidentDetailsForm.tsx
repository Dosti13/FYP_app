import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  
  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Initialize with existing data if available, otherwise current date
    if (incidentData.occurred_at) {
      const existingDate = new Date(incidentData.occurred_at);
      return isNaN(existingDate.getTime()) ? new Date() : existingDate;
    }
    return new Date();
  });

  // Format date and time for display and storage
  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Handle date selection
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (event.type === 'dismissed') {
      return;
    }
    
    if (selectedDate) {
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(selectedDate.getHours());
      newDateTime.setMinutes(selectedDate.getMinutes());
      
      setSelectedDate(newDateTime);
      onUpdateIncident({ occurred_at: formatDateTime(newDateTime) });
    }
  };

  // Handle time selection
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (event.type === 'dismissed') {
      return;
    }
    
    if (selectedTime) {
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      
      setSelectedDate(newDateTime);
      onUpdateIncident({ occurred_at: formatDateTime(newDateTime) });
    }
  };

  // Open date picker
  const openDatePicker = () => {
    console.log('Opening date picker...');
    setShowDatePicker(true);
  };

  // Open time picker
  const openTimePicker = () => {
    console.log('Opening time picker...');
    setShowTimePicker(true);
  };

  // Close pickers (for iOS)
  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const closeTimePicker = () => {
    setShowTimePicker(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Incident Details</Text>
      <Text style={styles.subtitle}>When did this happen?</Text>

      {/* Date Time Picker Section */}
      <View style={styles.dateTimeContainer}>
        <Text style={styles.fieldLabel}>Date & Time of Incident *</Text>
        
        <View style={styles.dateTimeRow}>
          {/* Date Picker Button */}
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={openDatePicker}
            activeOpacity={0.7}
          >
            <View style={styles.dateTimeButtonContent}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <View style={styles.dateTimeTextContainer}>
                <Text style={styles.dateTimeLabel}>Date</Text>
                <Text style={styles.dateTimeButtonText}>
                  {selectedDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Time Picker Button */}
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={openTimePicker}
            activeOpacity={0.7}
          >
            <View style={styles.dateTimeButtonContent}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <View style={styles.dateTimeTextContainer}>
                <Text style={styles.dateTimeLabel}>Time</Text>
                <Text style={styles.dateTimeButtonText}>
                  {selectedDate.toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Selected DateTime Display */}
        {incidentData.occurred_at && (
          <View style={styles.selectedDateTimeContainer}>
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
            <Text style={styles.selectedDateTimeText}>
              Selected: {incidentData.occurred_at}
            </Text>
          </View>
        )}

        {/* Date Picker Modal */}
        {showDatePicker && (
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Date</Text>
                {Platform.OS === 'ios' && (
                  <TouchableOpacity onPress={closeDatePicker} style={styles.doneButton}>
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                textColor={colors.text}
                accentColor={colors.primary}
                style={styles.picker}
              />
            </View>
          </View>
        )}

        {/* Time Picker Modal */}
        {showTimePicker && (
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Time</Text>
                {Platform.OS === 'ios' && (
                  <TouchableOpacity onPress={closeTimePicker} style={styles.doneButton}>
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="time"
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={handleTimeChange}
                textColor={colors.text}
                accentColor={colors.primary}
                style={styles.picker}
              />
            </View>
          </View>
        )}
      </View>

      {/* Estimated Loss Input */}
      <Input
        label="Estimated Total Loss (PKR)"
        placeholder="e.g., 50000"
        keyboardType="numeric"
        value={incidentData.value_estimate}
        onChangeText={(text) => onUpdateIncident({ value_estimate: text })}
      />

      {/* FIR Filed Checkbox */}
      <TouchableOpacity
        style={[styles.checkboxContainer, incidentData.fir_filed && styles.checkedContainer]}
        onPress={() => onUpdateIncident({ fir_filed: !incidentData.fir_filed })}
        activeOpacity={0.7}
      >
        <View style={styles.checkboxIconContainer}>
          <Ionicons
            name={incidentData.fir_filed ? "checkbox" : "checkbox-outline"}
            size={24}
            color={incidentData.fir_filed ? colors.primary : colors.mutedText}
          />
        </View>
        <View style={styles.checkboxTextContainer}>
          <Text style={styles.checkboxLabel}>FIR filed with police</Text>
          <Text style={styles.checkboxSubtext}>
            Check if you have already filed a First Information Report
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Victim Information Section */}
      <Text style={styles.sectionTitle}>Victim Information (Optional)</Text>
      <Text style={styles.sectionSubtitle}>
        This information is optional and will be kept confidential
      </Text>

      {/* Full Name */}
      <Input
        label="Full Name"
        placeholder="Enter full name (optional)"
        value={victimData.name}
        onChangeText={(text) => onUpdateVictim({ name: text })}
      />

      {/* Age and Gender Row */}
      <View style={styles.rowContainer}>
        {/* Age Input */}
        <View style={styles.ageContainer}>
          <Input
            label="Age"
            placeholder="25"
            keyboardType="numeric"
            value={victimData.age}
            onChangeText={(text) => onUpdateVictim({ age: text })}
          />
        </View>

        {/* Gender Selection */}
        <View style={styles.genderFieldContainer}>
          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.genderOptionsWrapper}>
            {genderOptions.map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderOptionButton,
                  victimData.gender === gender && styles.selectedGenderOption
                ]}
                onPress={() => onUpdateVictim({ gender })}
                activeOpacity={0.7}
              >
                <View style={styles.genderButtonContent}>
                  {/* Gender Icon */}
                  <Ionicons
                    name={
                      gender === 'Male' ? 'male' :
                      gender === 'Female' ? 'female' : 'people'
                    }
                    size={16}
                    color={victimData.gender === gender ? '#fff' : colors.primary}
                  />
                  <Text style={[
                    styles.genderOptionText,
                    victimData.gender === gender && styles.selectedGenderText
                  ]}>
                    {gender}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Contact Information */}
      <Input
        label="Phone Number"
        placeholder="+92-300-1234567"
        keyboardType="phone-pad"
        value={victimData.phone_number}
        onChangeText={(text) => onUpdateVictim({ phone_number: text })}
      />

      <Input
        label="Email Address"
        placeholder="example@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={victimData.email}
        onChangeText={(text) => onUpdateVictim({ email: text })}
      />

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
    opacity: 0.3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.mutedText,
    marginBottom: 20,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  // Date Time Picker Styles
  dateTimeContainer: {
    marginBottom: 24,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dateTimeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: colors.mutedText,
    fontWeight: '500',
    marginBottom: 2,
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  selectedDateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  selectedDateTimeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  doneButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  picker: {
    height: 120,
  },

  // Checkbox Styles
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkedContainer: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
  },
  checkboxIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  checkboxSubtext: {
    fontSize: 13,
    color: colors.mutedText,
    lineHeight: 18,
  },

  // Row Container Styles
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  ageContainer: {
    flex: 1,
    marginRight: 12,
  },
  genderFieldContainer: {
    flex: 2,
    marginLeft: 12,
  },

  // Enhanced Gender Selection Styles
  genderOptionsWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  genderOptionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedGenderOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    elevation: 6,
  },
  genderButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderOptionText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  selectedGenderText: {
    color: '#fff',
  },
  bottomSpacing: {
    height: 40,
  },
});