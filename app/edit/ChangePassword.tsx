// screens/ChangePassword.tsx - Complete Change Password Screen
import React, { useState } from 'react';
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
import { apiService, authService } from '@/services';

export default function ChangePassword() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  // Validate password
  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    return '';
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    // Current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New password
    const newPasswordError = validatePassword(formData.newPassword);
    if (newPasswordError) {
      newErrors.newPassword = newPasswordError;
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if new password is same as current
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleChangePassword = async () => {
    // Validate
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Attempting password change');

      await authService.changePassword(
        formData.currentPassword,
        formData.newPassword
      );

      console.log('✅ Password changed successfully');

      Alert.alert(
        'Success',
        'Your password has been changed successfully.\n\nFor security, you will be logged out. Please login with your new password.',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Logout and redirect to login
              await authService.logout();
              router.replace('/(auth)/Signin');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Change password error:', error);

      let errorMessage = 'Failed to change password. Please try again.';

      if (error.message) {
        const msg = error.message.toLowerCase();
        
        if (msg.includes('incorrect') || msg.includes('invalid') || msg.includes('wrong')) {
          errorMessage = 'Current password is incorrect. Please check and try again.';
          setErrors({ ...errors, currentPassword: 'Incorrect password' });
        } else if (msg.includes('same') || msg.includes('cannot be the same')) {
          errorMessage = 'New password must be different from current password.';
          setErrors({ ...errors, newPassword: 'Must be different from current password' });
        } else if (msg.includes('weak') || msg.includes('common')) {
          errorMessage = 'New password is too weak. Please choose a stronger password.';
          setErrors({ ...errors, newPassword: 'Password too weak' });
        } else if (msg.includes('unauthorized') || msg.includes('401')) {
          errorMessage = 'Session expired. Please login again.';
          setTimeout(() => {
            authService.logout();
            router.replace('/(auth)/Signin');
          }, 2000);
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const isFormValid = 
    formData.currentPassword.length > 0 &&
    formData.newPassword.length >= 8 &&
    formData.confirmPassword.length > 0 &&
    formData.newPassword === formData.confirmPassword;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="key" size={50} color="#007AFF" />
            <Text style={styles.headerTitle}>Change Password</Text>
            <Text style={styles.headerSubtitle}>
              Choose a strong password to keep your account secure
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={24} color="#34C759" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Password Requirements:</Text>
            <Text style={styles.infoText}>• At least 8 characters long</Text>
            <Text style={styles.infoText}>• At least one uppercase letter</Text>
            <Text style={styles.infoText}>• At least one lowercase letter</Text>
            <Text style={styles.infoText}>• At least one number</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Current Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={formData.currentPassword}
                onChangeText={(text) => {
                  setFormData({ ...formData, currentPassword: text });
                  if (errors.currentPassword) {
                    setErrors({ ...errors, currentPassword: '' });
                  }
                }}
                placeholder="Enter current password"
                placeholderTextColor="#999"
                secureTextEntry={!showPasswords.current}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              >
                <Ionicons 
                  name={showPasswords.current ? "eye-off" : "eye"} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            {errors.currentPassword ? (
              <Text style={styles.errorText}>{errors.currentPassword}</Text>
            ) : null}
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={formData.newPassword}
                onChangeText={(text) => {
                  setFormData({ ...formData, newPassword: text });
                  if (errors.newPassword) {
                    setErrors({ ...errors, newPassword: '' });
                  }
                }}
                placeholder="Enter new password"
                placeholderTextColor="#999"
                secureTextEntry={!showPasswords.new}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              >
                <Ionicons 
                  name={showPasswords.new ? "eye-off" : "eye"} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            {errors.newPassword ? (
              <Text style={styles.errorText}>{errors.newPassword}</Text>
            ) : null}
            
            {/* Password Strength Indicator */}
            {formData.newPassword.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  <View 
                    style={[
                      styles.strengthFill,
                      { 
                        width: `${Math.min((formData.newPassword.length / 12) * 100, 100)}%`,
                        backgroundColor: 
                          formData.newPassword.length < 8 ? '#FF3B30' :
                          formData.newPassword.length < 10 ? '#FF9500' :
                          '#34C759'
                      }
                    ]}
                  />
                </View>
                <Text style={styles.strengthText}>
                  {formData.newPassword.length < 8 ? 'Weak' :
                   formData.newPassword.length < 10 ? 'Medium' : 'Strong'}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={formData.confirmPassword}
                onChangeText={(text) => {
                  setFormData({ ...formData, confirmPassword: text });
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: '' });
                  }
                }}
                placeholder="Re-enter new password"
                placeholderTextColor="#999"
                secureTextEntry={!showPasswords.confirm}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              >
                <Ionicons 
                  name={showPasswords.confirm ? "eye-off" : "eye"} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : formData.confirmPassword.length > 0 && formData.newPassword === formData.confirmPassword ? (
              <View style={styles.matchContainer}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={styles.matchText}>Passwords match</Text>
              </View>
            ) : null}
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={[
              styles.changeButton,
              (!isFormValid || loading) && styles.changeButtonDisabled,
            ]}
            onPress={handleChangePassword}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.changeButtonText}>Change Password</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            disabled={loading}
          >
            <Text style={styles.clearButtonText}>Clear Form</Text>
          </TouchableOpacity>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.securityText}>
            For your security, you will be logged out after changing your password. 
            You'll need to login again with your new password.
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
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F1F8F4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 20,
  },
  form: {
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 4,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 4,
  },
  matchText: {
    fontSize: 12,
    color: '#34C759',
    marginLeft: 4,
    fontWeight: '500',
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  changeButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  changeButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  changeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  clearButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  securityNote: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  securityText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 20,
  },
});