import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

interface Report {
  id: string;
  title: string;
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
    // TODO: Replace with actual API call
    const fetchReport = async () => {
      try {
        // Simulate API call
        const mockReport: Report = {
          id: id as string,
          title: 'Suspicious Activity',
          description: 'Suspicious person spotted near school premises',
          location: '123 Main Street, City',
          date: new Date().toISOString(),
          status: 'pending',
          imageUrl: 'https://example.com/image.jpg'
        };
        
        setReport(mockReport);
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
      <View style={styles.loadingContainer}>
        <Text>Loading report details...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text>Report not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{report.title}</Text>
        <View style={[
          styles.statusBadge, 
          report.status === 'resolved' ? styles.resolvedBadge : styles.pendingBadge
        ]}>
          <Text style={styles.statusText}>{report.status}</Text>
        </View>
      </View>

      {report.imageUrl && (
        <Image 
          source={{ uri: report.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={20} color="#666" />
          <Text style={styles.detailText}>{report.location}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={20} color="#666" />
          <Text style={styles.detailText}>
            {new Date(report.date).toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.description}>{report.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
  },
  resolvedBadge: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    textTransform: 'capitalize',
    fontSize: 14,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    color: '#333',
  },
});