import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiService } from "../api/apiSerivce";

const HEATMAP_KEY = "HEATMAP_CACHE";

export async function refreshHeatmap(city = "Karachi") {
  try {

    const heatmap = await apiService.getHeatmap({
      days: 30,
    });


    await AsyncStorage.setItem(HEATMAP_KEY, JSON.stringify(heatmap));
    console.log("💾 Heatmap saved to cache");
  } catch (error) {
    console.error("❌ Heatmap fetch failed:", error);
  }
}

export async function getCachedHeatmap() {
  try {
    const stored = await AsyncStorage.getItem(HEATMAP_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    return parsed;
  } catch (error) {
    console.error("❌ Heatmap read error:", error);
    return [];
  }
}
