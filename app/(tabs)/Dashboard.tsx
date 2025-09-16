import { Text ,ScrollView,Image} from 'react-native';
import { Button } from '../../components/common/Button';
import { useRouter } from 'expo-router';
import React, { useEffect } from "react";
import * as Location from "expo-location";
import { restrictedAreaWatcher } from '../../services/background/restrictedAreaWatcher';
// import { restrictedAreas } from '../../utils/dumyData';
// import { locationService } from '../../services/api/locationSevice';
// import { notificationService } from '../../services/api/notificationService';
export default function Dashboard() {
  const route = useRouter();
  
  useEffect(() => {
    // Start background watcher when app loads
    restrictedAreaWatcher.startWatching();

    return () => {
      restrictedAreaWatcher.stopWatching();
    };
  }, []);


  const handleAddReport = () => {
    route.navigate('/report/add');
  };
  return (
    <ScrollView>
      <Image resizeMode='contain' source={require('../../assets/images/Map-Marker.png')} style={{width:100,height:100,alignSelf:'center',marginTop:50}} />
      <Text style={{fontSize:30, textAlign:'center', marginTop:50}}>
        Home Screen
      </Text>
      <Button
                title="Add Report"
                icon="add"
                onPress={handleAddReport}
                style={{ margin: 20 }}  
              />
    </ScrollView>
  );

}