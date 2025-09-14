import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";

export default function CustomHeader() {
  const pathname = usePathname();
  const router = useRouter();

  // Map paths to titles
  const titles: Record<string, string> = {
    "/(tabs)/dashboard": "Dashboard",
    "/(tabs)/reportlist": "Report List",
    "/(tabs)/map": "Map",
    "/(tabs)/profile": "Profile",
  };

  const title = titles[pathname] || "App";
   const current = pathname.split("/").pop() || "dashboard";
console.log(current);

  const showBack = pathname !== "/(tabs)/dashboard"; // only hide on Dashboard

  return (
    <View style={styles.header}>
      {/* Left: Back arrow if not dashboard */}
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Middle: Tab Title */}
      <Text style={styles.title}>{current}</Text>

      {/* Right: Map Marker */}
      <View style={styles.right}>
        <Ionicons name="location-outline" size={24} color="white" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  left: {
    width: 40,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  right: {
    width: 40,
    alignItems: "flex-end",
  },
});
