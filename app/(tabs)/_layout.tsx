import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StatusBar } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#4CA30D',
          tabBarInactiveTintColor: '#8E8E93',
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="Dashboard" 
          options={{ 
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="Reportlist" 
          options={{ 
            title: 'Reports',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
          }} 
          />
          <Tabs.Screen 
            name="Map" 
            options={{ 
              title: 'Map',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="map-outline" size={size} color={color} />
              ),
            }} 
          />
          <Tabs.Screen 
            name="Profile" 
            options={{ 
              title: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }} 
            />
      </Tabs>
    </View>
  );
}