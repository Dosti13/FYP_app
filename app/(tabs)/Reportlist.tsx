import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeScreen } from "../../components/common/SafeScreen";
import { Button } from "../../components/common/Button";
import { ReportCard } from "../../components/report/ReportCard";
import { ReportFilter } from "../../components/report/ReportFilter";
import { useApi } from "../../hooks/useApi";
import { apiService } from "../../services/api/apiSerivce";
import { colors } from "../../constants/theme";
import { useRouter } from 'expo-router';

export default function ReportListScreen() {
  const [filters, setFilters] = useState({});
  const route = useRouter();
  const { data: reports, loading, error, refetch } = useApi(
    () => apiService.getReports(filters),
    [filters]
  );

  const handleAddReport = () => {
    route.navigate('/report/add');
  };

  if (!loading) {
    return (
      <SafeScreen>
        <View style={styles.centerContainer}>
          <Text>Loading reports...</Text>
        </View>
      </SafeScreen>
    );
  }

  if (error) {
    return (
      <SafeScreen>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Button title="Retry" onPress={refetch} />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Recent Reports</Text>
          <ReportFilter onFiltersChange={setFilters} />
        </View>

        <FlatList
          data={reports?.reports || []}
          renderItem={({ item }) => <ReportCard report={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <Button
          title="Add Report"
          icon="add"
          onPress={handleAddReport}
          style={styles.addButton}
        />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  listContainer: {
    padding: 20,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
  },
  addButton: {
    margin: 20,
  },
});