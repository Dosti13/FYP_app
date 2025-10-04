import { Button } from '@/components/common/Button';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View
} from 'react-native';
import RestrictedAreaMap from "../../components/map/heatMap";
import { restrictedAreaWatcher } from "../../services/background/restrictedAreaWatcher";
import tabStyles from '../../utils/tabStyle';
import ReportListScreen from './Reportlist';
const { width, height } = Dimensions.get('window');

const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    // Start background watcher when app loads
    restrictedAreaWatcher.startWatching();

    return () => {
      restrictedAreaWatcher.stopWatching();
    };
  }, []);
  const MapArea = () => (
    <View style={tabStyles.mapContainer}>
      {/* Map background with city names */}
  <RestrictedAreaMap/>
    </View>
  );

  const ReportItem = ({    }) => (
    <View style={tabStyles.reportItem}>
      <ReportListScreen/>
    </View>
  );
console.log("dash");
  return (
    <SafeAreaView style={tabStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      
  

      {/* Map Section */}
      <MapArea />

      {/* Recent Reports Section */}
      <View style={tabStyles.reportsSection}>
        <Text style={tabStyles.sectionTitle}>Recent Reports</Text>
        <ScrollView style={tabStyles.reportsList} showsVerticalScrollIndicator={false}>
        </ScrollView>
      </View>

      {/* Add Report Button */}
      <Button style={tabStyles.addButton}
        title='Add Report'
        icon='add'
        onPress={() => router.navigate('/report/add')}
        />


  
    </SafeAreaView>
  );
};



export default Dashboard;