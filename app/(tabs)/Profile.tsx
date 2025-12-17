import { Button } from "@/components/common/Button";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import tabStyles from "../../utils/tabStyle";
import { authService } from "@/services";
export default function Account() {
  const route = useRouter();
  const {user,isSignedIn} = useUser()
  const { signOut } = useAuth()
  
  authService.getCurrentUser().then((userData) => {
    console.log("Current User Data in Profile Tab:", userData);
  }).catch((error) => {
    console.error("Error fetching current user data in Profile Tab:", error);
  });
  const  handlelogout=()=> {
    signOut()
    authService.logout();
    route.navigate('/Onbording')
  };
  return (
    <SafeAreaView style={tabStyles.container}>
      <Text style={tabStyles.header}>Profile & settings</Text>

      {/* Avatar */}
      <View style={tabStyles.avatarContainer}>
        <View style={tabStyles.avatar}>
          <Ionicons name="person" size={60} color={colors.mutedText} />
        </View>
        <Text style={tabStyles.name}>{user?.fullName}</Text>
        <Text style={tabStyles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>

      {/* Buttons */}
      <View style={tabStyles.buttonRow}>
        <Button title="see  my report"  style={tabStyles.addProfileBtn}  onPress={()=>route.navigate('/(tabs)/Reportlist')}/>
       <Button title="Logout"  style={tabStyles.logoutBtn}  onPress={handlelogout}/>
      </View>

      {/* Menu */}
      <View style={tabStyles.menu}>
        <TouchableOpacity style={tabStyles.menuItem}
        onPress={() => route.navigate("/settings/HelpSupport")}
        >
          <Ionicons name="help-circle-outline" size={22} color={colors.text} />
          <Text style={tabStyles.menuText}>Help & support</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={tabStyles.menuItem} 
        onPress={() => route.navigate("/settings/TermsCondition")}
        >
          <Ionicons name="document-text-outline" size={22} color={colors.text} />
          <Text style={tabStyles.menuText}>Terms & conditions</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}


