import { Button } from '@/components/common/Button';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RestrictedAreaMap from "../../components/map/heatMap";
import { apiService } from '@/services';
import tabStyles from '../../utils/tabStyle';

interface DashboardStats {
  totalIncidents: number;
  pendingReports: number;
  resolvedReports: number;
  recentIncrease: number;
}

interface RecentIncident {
  id: number;
  incident_type: { category: string };
  location: { city: string; district: string };
  occurred_at: string;
  status: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    pendingReports: 0,
    resolvedReports: 0,
    recentIncrease: 0
  });
  const [recentIncidents, setRecentIncidents] = useState<RecentIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statistics = await apiService.getStatistics({ days: 30 });
      
      // Fetch recent incidents (limited to 5)
      const incidents = await apiService.getIncidents({ 
        page_size: 5,
        ordering: '-created_at'
      });

      // Calculate stats
      const pending = incidents.filter(i => i.status === 'pending').length;
      const resolved = incidents.filter(i => i.status === 'resolved').length;

      setStats({
        totalIncidents: statistics.total_incidents,
        pendingReports: pending,
        resolvedReports: resolved,
        recentIncrease: 12 // Could calculate from API if available
      });

      setRecentIncidents(incidents);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, subtitle, color }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <View style={[tabStyles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <Text style={tabStyles.statTitle}>{title}</Text>
      <Text style={tabStyles.statValue}>{value}</Text>
      {subtitle && <Text style={tabStyles.statSubtitle}>{subtitle}</Text>}
    </View>
  );


  const QuickActions = () => (
    <View style={tabStyles.quickActionsContainer}>
      <Text style={tabStyles.sectionTitle}>Quick Actions</Text>
      <View style={tabStyles.quickActionsGrid}>
        <TouchableOpacity 
          style={tabStyles.quickActionButton}
          onPress={() => router.push('/(tabs)/Reportlist')}
        >
          <Text style={tabStyles.quickActionIcon}>📝</Text>
          <Text style={tabStyles.quickActionText}>Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={tabStyles.quickActionButton}
          onPress={() => router.push('/report/imei')}
        >
          <Text style={tabStyles.quickActionIcon}>📱</Text>
          <Text style={tabStyles.quickActionText}>Check IMEI</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={tabStyles.quickActionButton}
          onPress={() => router.push('/report/alert')}
        >
          <Text style={tabStyles.quickActionIcon}>⚠️</Text>
          <Text style={tabStyles.quickActionText}>Alerts</Text>
        </TouchableOpacity>
        

      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={tabStyles.container}>
        <View style={tabStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={tabStyles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tabStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={tabStyles.header}>
          <Text style={tabStyles.headerTitle}>Dashboard</Text>
          <Text style={tabStyles.headerSubtitle}>Crime Report Overview</Text>
        </View>

        {/* Statistics Cards */}
        <View style={tabStyles.statsContainer}>
          <StatCard 
            title="Total Reports" 
            value={stats.totalIncidents} 
            subtitle="Last 30 days"
            color="#2196F3"
          />
          <StatCard 
            title="Pending" 
            value={stats.pendingReports} 
            color="#FFA500"
          />
          <StatCard 
            title="Resolved" 
            value={stats.resolvedReports} 
            color="#4CAF50"
          />
          <StatCard 
            title="Trend" 
            value={`+${stats.recentIncrease}%`} 
            subtitle="vs last month"
            color="#9C27B0"
          />
        </View>

        {/* Quick Actions */}
        <QuickActions />
        {/* Map Section */}
        <View style={tabStyles.mapSection}>
          <Text style={tabStyles.sectionTitle}>Crime Heatmap</Text>
          <View style={tabStyles.mapContainer}>
            <RestrictedAreaMap />
          </View>
        </View>


        

        {/* Bottom spacing for the floating button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Report Button */}
      <View style={tabStyles.floatingButtonContainer}>
        <Button 
          style={tabStyles.addButton}
          title='Report Incident'
          icon='add'
          onPress={() => router.navigate('/report/add')}
        />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;