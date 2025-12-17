import { Button } from '@/components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';
import { apiService } from '@/services';
import { incidentTypes, IncidentType } from '../../constants/reportTypes';

interface Report {
  id: number;
  location: string;
  type: string;
  time: string;
  createdAt: string;
}

const route = useRouter();

export default function ReportListScreen() {
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<IncidentType | 'All'>('All');
  const [sortByLatest, setSortByLatest] = useState(true);

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiService.getReports();
        const mapped: Report[] = data.map((item: any) => ({
          id: item.id,
          location: item.location?.street_address || item.location?.area || item.location?.city || 'Unknown',
          type: item.incident_type?.category || 'Unknown',
          time: item.occurred_at
            ? new Date(item.occurred_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A',
          createdAt: item.occurred_at || item.created_at,
        }));
        setReports(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filtered + Sorted Reports
  const filteredReports = useMemo(() => {
    let data = [...reports];

    if (search) {
      data = data.filter(r =>
        r.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedType !== 'All') {
      data = data.filter(r => r.type === selectedType.category);
    }

    data.sort((a, b) =>
      sortByLatest
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return data;
  }, [reports, search, selectedType, sortByLatest]);

  const renderItem = ({ item }: { item: Report }) => (
    <TouchableOpacity style={styles.card} onPress={() => route.navigate(`/report/${item.id}`)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.locationText}>{item.location}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={[
        styles.typeBadge,
        { backgroundColor: incidentTypes.find(t => t.category === item.type)?.color || colors.primary }
      ]}>
        <Text style={styles.typeText}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading reports...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by location"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter & Sort Row */}
      <View style={styles.filterSortRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          <FilterButton
            text="All"
            active={selectedType === 'All'}
            onPress={() => setSelectedType('All')}
          />
          {incidentTypes.map((type: IncidentType) => (
            <FilterButton
              key={type.id}
              text={type.category || type.id}
              active={selectedType?.id === type.id}
              color={type.color}
              onPress={() => setSelectedType(type)}
            />
          ))}
        </ScrollView>

        {/* Sort Button */}
        <TouchableOpacity
          onPress={() => setSortByLatest(!sortByLatest)}
          style={styles.sortBtn}
        >
          <Ionicons
            name={sortByLatest ? 'arrow-down' : 'arrow-up'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Reports List */}
      <FlatList
        data={filteredReports}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Add Report Button */}
      <View style={styles.addBtnWrapper}>
        <Button
          title="Add Report"
          icon="add"
          onPress={() => route.navigate('/report/add')}
          style={styles.addBtn}
        />
      </View>
    </SafeAreaView>
  );
}

// ---------------------- Filter Button ----------------------
interface FilterProps {
  text: string;
  active?: boolean;
  color?: string;
  onPress: () => void;
}

function FilterButton({ text, active, color, onPress }: FilterProps) {
  return (
    <TouchableOpacity
      style={[styles.filterBtn, active && { backgroundColor: color || colors.primary }]}
      onPress={onPress}
    >
      <Text style={[styles.filterText, active && { color: '#fff' }]}>{text}</Text>
    </TouchableOpacity>
  );
}

// ---------------------- Styles ----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  filterSortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  typeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  typeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  addBtnWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addBtn: {
    borderRadius: 30,
    paddingHorizontal: 24,
  },
});
