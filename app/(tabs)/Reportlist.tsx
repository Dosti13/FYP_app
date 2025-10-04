import { Button } from '@/components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';
import tabStyles from '../../utils/tabStyle';
interface Report {
  id: number;
  location: string;
  type: string;
  time: string;

}
const route = useRouter()
const dummyReports: Report[] = [
  { id: 1, location: 'Location 1', type: 'Theft', time: '10:00 AM' },
  { id: 2, location: 'Location 2', type: 'Theft', time: '11:00 AM' },
  { id: 3, location: 'Location 3', type: 'Robbery', time: '12:00 PM' },
  { id: 4, location: 'Location 4', type: 'Robbery', time: '01:00 PM' },
  { id: 5, location: 'Location 5', type: 'Robbery', time: '02:00 PM' },
];

export default function ReportListScreen() {
  const [search, setSearch] = useState('');

  const filteredReports = dummyReports.filter(report =>
    report.location.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Report }) => (
    <View style={tabStyles.reportCard}>
      <TouchableOpacity onPress={()=>  route.navigate(`/report/${item.id}`)}>
      <View style={{ flex: 1 }}>
        <Text style={tabStyles.locationText}>{item.location}</Text>
        <Text style={tabStyles.timeText}>{item.time}</Text>
      </View>
      <Text style={[tabStyles.typeText, item.type === 'Theft' ? tabStyles.theft : tabStyles.robbery]}>
        {item.type}
      </Text>
</TouchableOpacity>
    </View>
  );
console.log("reportlist");
  return (
    <SafeAreaView style={tabStyles.container}>
      {/* Search bar */}
      <View style={tabStyles.searchContainer}>
        <TextInput
          style={tabStyles.searchInput}
          placeholder="Enter a search area"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={tabStyles.searchButton}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Reports list */}
      <FlatList
        data={filteredReports}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={tabStyles.listContainer}
    
      />

      {/* Add report button */}
        <Button style={tabStyles.addButton}
            title='Add Report'
            icon='add'
            onPress={() => route.navigate('/report/add')}
            />
    </SafeAreaView>
  );
}

