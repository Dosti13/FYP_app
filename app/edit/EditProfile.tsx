import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {  authService } from '@/services';

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '', // Read-only
  });

  const [originalData, setOriginalData] = useState(formData);
  const [hasChanges, setHasChanges] = useState(false);

  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);

  // Check for changes
  useEffect(() => {
    const changed = 
      formData.first_name !== originalData.first_name ||
      formData.last_name !== originalData.last_name ||
      formData.phone !== originalData.phone;
    setHasChanges(changed);
  }, [formData, originalData]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      console.log(user," loaded user data from edit profile");
      
      if (user) {
        const data = {
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          phone: user.phone || '',
          email: user.email || '',
        };
        setFormData(data);
        setOriginalData(data);
      }
    } catch (error) {
      console.error('Load user error:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.first_name.trim()) {
      Alert.alert('Validation Error', 'First name is required');
      return;
    }
    if (!formData.last_name.trim()) {
      Alert.alert('Validation Error', 'Last name is required');
      return;
    }

    setSaving(true);

    try {
      // Update profile
      console.log(formData, "updating profile with data");
      
      const updated = await authService.updateProfile({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),

      });

      console.log('✅ Profile updated:', updated);

      Alert.alert(
        'Success',
        'Your profile has been updated successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              setOriginalData(formData);
              setHasChanges(false);
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    router.push('/edit/ChangePassword');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Delete Account',
      'Are you absolutely sure you want to delete your account?\n\n' +
      'This action is PERMANENT and cannot be undone. All your data including:\n' +
      '• Profile information\n' +
      '• Reported incidents\n' +
      '• Registered IMEIs\n' +
      'will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => confirmDeleteAccount(),
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Final Confirmation',
      'Type DELETE below to confirm account deletion',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Proceed',
          style: 'destructive',
          onPress: () => executeDeleteAccount(),
        },
      ]
    );
  };

  const executeDeleteAccount = async () => {
    setDeleting(true);

    try {
      await authService.deleteAccount();
      
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted. We\'re sorry to see you go.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(auth)/Signin');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Delete account error:', error);
      Alert.alert('Error', error.message || 'Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  const handleDiscard = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleDiscard}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.first_name}
              onChangeText={(text) => setFormData({ ...formData, first_name: text })}
              placeholder="Enter first name"
              editable={!saving && !deleting}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.last_name}
              onChangeText={(text) => setFormData({ ...formData, last_name: text })}
              placeholder="Enter last name"
              editable={!saving && !deleting}
            />
          </View>

          {/* Email (Read-only) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.input, styles.inputDisabled]}>
              <Text style={styles.inputDisabledText}>{formData.email}</Text>
            </View>
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="+923001234567"
              keyboardType="phone-pad"
              editable={!saving && !deleting}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!hasChanges || saving || deleting) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!hasChanges || saving || deleting}
          >
            {saving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>

          {hasChanges && (
            <Text style={styles.unsavedText}>You have unsaved changes</Text>
          )}
        </View>

        {/* Additional Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleChangePassword}
            disabled={saving || deleting}
          >
            <Ionicons name="key-outline" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDeleteAccount}
            disabled={saving || deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#FF3B30" size="small" />
            ) : (
              <>
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                <Text style={[styles.actionButtonText, styles.dangerText]}>
                  Delete Account
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Warning Note */}
        <View style={styles.warningBox}>
          <Ionicons name="information-circle" size={20} color="#FF9500" />
          <Text style={styles.warningText}>
            Deleting your account is permanent and cannot be undone. All your data will be lost.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  inputDisabledText: {
    fontSize: 16,
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  unsavedText: {
    fontSize: 12,
    color: '#FF9500',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  actionsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  dangerButton: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#FF3B30',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#F57C00',
    lineHeight: 18,
  },
});