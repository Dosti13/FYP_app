import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '@/services';
import { authService } from '@/services';

interface Report {
  id: number;
  title: string;
  category?: string;
  description: string;
  location: {
    province?: string;
    city?: string;
    district?: string;
    neighborhood?: string;
    street_address?: string;
    latitude?: string;
    longitude?: string;
  };
  date: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'reported' | string;
  imageUrl?: string;
  stolenItem?: {
    item_type?: string;
    description?: string;
    value_estimate?: string;
    imei?: string;
    phone_brand?: string;
    phone_model?: string;
    license_plate?: string;
    chassis_number?: string;
    vehicle_make?: string;
    vehicle_model?: string;
  };
  firFiled: boolean;
  isAnonymous: boolean;
}

export default function ReportDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!id) return;


        // Fetch report details
        const data = await apiService.getIncidentDetails(Number(id));
        if (!data) {
          setReport(null);
          return;
        }


        const mapped: Report = {
          id: data.id,
          title: data.incident_type?.category || 'Report',
          category: data.incident_type?.category,
          description: data.description || 'No description provided',
          location: {
            province: data.location?.province,
            city: data.location?.city,
            district: data.location?.district,
            neighborhood: data.location?.neighborhood,
            street_address: data.location?.street_address,
            latitude: data.location?.latitude,
            longitude: data.location?.longitude,
          },
          date: data.occurred_at || data.created_at,
          createdAt: data.created_at,
          status: data.status || 'pending',
          stolenItem: data.stolen_item ? {
            item_type: data.stolen_item.item_type,
            description: data.stolen_item.description,
            value_estimate: data.stolen_item.value_estimate,
            imei: data.stolen_item.imei,
            phone_brand: data.stolen_item.phone_brand,
            phone_model: data.stolen_item.phone_model,
            license_plate: data.stolen_item.license_plate,
            chassis_number: data.stolen_item.chassis_number,
            vehicle_make: data.stolen_item.vehicle_make,
            vehicle_model: data.stolen_item.vehicle_model,
          } : undefined,
          firFiled: data.fir_filed || false,
          isAnonymous: data.is_anonymous || false,
        };

        setReport(mapped);

     
        
        // Check authorship regardless of anonymous status
        // The API will determine ownership based on the token
        await checkIfAuthor(mapped.id);
        
      } catch (error) {
        console.error('❌ Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const checkIfAuthor = async (reportId: number) => {
    try {
      let debugMsg = '';
      
      // Check if user is authenticated
      console.log('🔐 Checking if user is authenticated...');
      const isAuthenticated = await authService.isAuthenticated();
      
      if (!isAuthenticated) {
        setIsAuthor(false);
        return;
      }

      // Get current user
      const currentUser = await authService.getCurrentUser();
      console.log('👤 Current user:', currentUser);

      // Fetch all incidents created by the current user
      // This API call uses the token to determine which incidents belong to the user

      const myIncidents = await apiService.getMyIncidents();
      console.log('📋 My incidents count:', myIncidents.length);
      console.log('📋 My incident IDs:', myIncidents.map(i => i.id));

      // Check if current incident ID is in user's incidents
      // This works even for anonymous reports because the backend
      // uses the auth token to determine ownership
      const isOwner = myIncidents.some((incident) => {
        // Handle both string and number IDs
        return Number(incident.id) === Number(reportId);
      });
      

      
      setIsAuthor(isOwner);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setIsAuthor(false);
    }
  };

  const handleUpdate = () => {
    // Navigate to edit screen
    router.push(`/report/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Call your API service to delete the incident
              await apiService.deleteIncident(Number(id));
              
              Alert.alert('Success', 'Report deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              console.error('Error deleting report:', error);
              Alert.alert('Error', 'Failed to delete report. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.loadingText}>Loading report details...</Text>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Report not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f7" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Debug Info Box - Remove this after debugging */}
    

        {/* Header Section */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{report.title}</Text>
            {report.category && <Text style={styles.category}>{report.category}</Text>}
          </View>
          <View
            style={[
              styles.statusBadge,
              report.status === 'resolved' 
                ? styles.resolvedBadge 
                : report.status === 'reported'
                ? styles.reportedBadge
                : styles.pendingBadge,
            ]}
          >
            <Text style={styles.statusText}>{report.status}</Text>
          </View>
        </View>

        {/* Action Buttons for Author */}
        {isAuthor && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.updateButton} 
              onPress={handleUpdate}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Image Section */}
        {report.imageUrl && (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: report.imageUrl }} style={styles.image} resizeMode="cover" />
          </View>
        )}

        {/* Basic Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Incident Details</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={22} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Occurred At</Text>
              <Text style={styles.detailText}>
                {new Date(report.date).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={22} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Reported At</Text>
              <Text style={styles.detailText}>
                {new Date(report.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={22} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>FIR Filed</Text>
              <Text style={styles.detailText}>{report.firFiled ? 'Yes' : 'No'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="eye-off-outline" size={22} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Anonymous Report</Text>
              <Text style={styles.detailText}>{report.isAnonymous ? 'Yes' : 'No'}</Text>
            </View>
          </View>
        </View>

        {/* Location Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Location Information</Text>
          
          {report.location.street_address && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={22} color="#666" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Street Address</Text>
                <Text style={styles.detailText}>{report.location.street_address}</Text>
              </View>
            </View>
          )}

          {report.location.neighborhood && (
            <View style={styles.detailRow}>
              <Ionicons name="navigate-outline" size={22} color="#666" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Neighborhood</Text>
                <Text style={styles.detailText}>{report.location.neighborhood}</Text>
              </View>
            </View>
          )}

          {report.location.district && (
            <View style={styles.detailRow}>
              <Ionicons name="map-outline" size={22} color="#666" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>District</Text>
                <Text style={styles.detailText}>{report.location.district}</Text>
              </View>
            </View>
          )}

          {report.location.city && (
            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={22} color="#666" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>City</Text>
                <Text style={styles.detailText}>{report.location.city}</Text>
              </View>
            </View>
          )}

          {report.location.province && (
            <View style={styles.detailRow}>
              <Ionicons name="globe-outline" size={22} color="#666" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Province</Text>
                <Text style={styles.detailText}>{report.location.province}</Text>
              </View>
            </View>
          )}

          {report.location.latitude && report.location.longitude && (
            <View style={styles.detailRow}>
              <Ionicons name="pin-outline" size={22} color="#666" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Coordinates</Text>
                <Text style={styles.detailText}>
                  {report.location.latitude}, {report.location.longitude}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Stolen Item Details Card */}
        {report.stolenItem && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Stolen Item Details</Text>
            
            {report.stolenItem.item_type && (
              <View style={styles.detailRow}>
                <Ionicons name="phone-portrait-outline" size={22} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Item Type</Text>
                  <Text style={styles.detailText}>{report.stolenItem.item_type}</Text>
                </View>
              </View>
            )}

            {report.stolenItem.description && (
              <View style={styles.detailRow}>
                <Ionicons name="information-circle-outline" size={22} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Item Description</Text>
                  <Text style={styles.detailText}>{report.stolenItem.description}</Text>
                </View>
              </View>
            )}

            {report.stolenItem.value_estimate && report.stolenItem.value_estimate !== '0.00' && (
              <View style={styles.detailRow}>
                <Ionicons name="cash-outline" size={22} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Estimated Value</Text>
                  <Text style={styles.detailText}>PKR {report.stolenItem.value_estimate}</Text>
                </View>
              </View>
            )}

            {report.stolenItem.imei && (
              <View style={styles.detailRow}>
                <Ionicons name="barcode-outline" size={22} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>IMEI</Text>
                  <Text style={styles.detailText}>{report.stolenItem.imei}</Text>
                </View>
              </View>
            )}

            {report.stolenItem.phone_brand && (
              <View style={styles.detailRow}>
                <Ionicons name="phone-portrait-outline" size={22} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Phone Brand</Text>
                  <Text style={styles.detailText}>{report.stolenItem.phone_brand}</Text>
                </View>
              </View>
            )}

            {report.stolenItem.phone_model && (
              <View style={styles.detailRow}>
                <Ionicons name="phone-portrait-outline" size={22} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Phone Model</Text>
                  <Text style={styles.detailText}>{report.stolenItem.phone_model}</Text>
                </View>
              </View>
            )}

            {report.stolenItem.license_plate && (
              <View style={styles.detailRow}>
                <Ionicons name="car-outline" size={22} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>License Plate</Text>
                  <Text style={styles.detailText}>{report.stolenItem.license_plate}</Text>
                </View>
              </View>
            )}

            {report.stolenItem.chassis_number && (
              <View style={styles.detailRow}>
                <Ionicons name="construct-outline" size={22} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Chassis Number</Text>
                  <Text style={styles.detailText}>{report.stolenItem.chassis_number}</Text>
                </View>
              </View>
            )}

            {report.stolenItem.vehicle_make && (
              <View style={styles.detailRow}>
                <Ionicons name="car-sport-outline" size={22} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Vehicle Make</Text>
                  <Text style={styles.detailText}>{report.stolenItem.vehicle_make}</Text>
                </View>
              </View>
            )}

            {report.stolenItem.vehicle_model && (
              <View style={styles.detailRow}>
                <Ionicons name="car-sport-outline" size={22} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Vehicle Model</Text>
                  <Text style={styles.detailText}>{report.stolenItem.vehicle_model}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Description Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{report.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------- Styles ----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  debugBox: {
    backgroundColor: '#fff3cd',
    borderWidth: 2,
    borderColor: '#ffc107',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#856404',
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
  },
  category: {
    fontSize: 16,
    color: '#888',
    marginTop: 6,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginLeft: 12,
  },
  pendingBadge: { backgroundColor: '#FFF3E0' },
  resolvedBadge: { backgroundColor: '#E8F5E9' },
  reportedBadge: { backgroundColor: '#E3F2FD' },
  statusText: {
    textTransform: 'capitalize',
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  updateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#3498db',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#e74c3c',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#eee',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 280,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    fontWeight: '600',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    color: '#444',
  },
});