import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '@/services';

interface Report {
  id: string;
  title: string;
  category?: string;
  description: string;
  location: string;
  date: string;
  status: 'pending' | 'resolved';
  imageUrl?: string;
}

export default function ReportDetails() {
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!id) return;

        const data = await apiService.getReportDetails(Number(id));
        if (!data) {
          setReport(null);
          return;
        }

        const mapped: Report = {
          id: data.id,
          title: data.incident_type?.category || 'Report',
          category: data.incident_type?.category,
          description: data.description || 'No description provided',
          location: data.location?.street_address || data.location?.area || data.location?.city || 'Unknown location',
          date: data.occurred_at || data.created_at,
          status: data.status || 'pending',
          imageUrl: data.image || undefined,
        };

        setReport(mapped);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Loading report details...</Text>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Report not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f7" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{report.title}</Text>
            {report.category && <Text style={styles.category}>{report.category}</Text>}
          </View>
          <View
            style={[
              styles.statusBadge,
              report.status === 'resolved' ? styles.resolvedBadge : styles.pendingBadge,
            ]}
          >
            <Text style={styles.statusText}>{report.status}</Text>
          </View>
        </View>

        {report.imageUrl && (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: report.imageUrl }} style={styles.image} resizeMode="cover" />
          </View>
        )}

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={22} color="#666" />
            <Text style={styles.detailText}>{report.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={22} color="#666" />
            <Text style={styles.detailText}>
              {new Date(report.date).toLocaleString()}
            </Text>
          </View>

          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>{report.description}</Text>
          </View>
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
  statusText: {
    textTransform: 'capitalize',
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
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
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 17,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  descriptionWrapper: {
    marginTop: 12,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    color: '#444',
  },
});
