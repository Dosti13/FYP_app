import { Button } from '@/components/common/Button';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View
} from 'react-native';
import RestrictedAreaMap from "../../components/map/heatMap";
import tabStyles from '../../utils/tabStyle';
import ReportListScreen from './Reportlist';
const Dashboard = () => {
  const router = useRouter();
 

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