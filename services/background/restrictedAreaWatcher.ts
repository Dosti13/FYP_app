import * as Location from "expo-location";
import { TASK_NAME } from "./restrictedAreaTask";

class RestrictedAreaWatcher {
  async startWatching() {
    console.log("📍 Starting restricted area watcher...");

    const fg = await Location.requestForegroundPermissionsAsync();
    if (fg.status !== "granted") return;

    const bg = await Location.requestBackgroundPermissionsAsync();
    if (bg.status !== "granted") return;

    await Location.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: Location.Accuracy.High,
        timeInterval: 30000,      // ⏱️ at least 30 seconds
    distanceInterval: 100, 
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Safety Monitoring Active",
        notificationBody: "Monitoring nearby crime-prone areas",
      },
    });

    console.log("✅ Restricted area watcher started");
  }

  async stopWatching() {
    const running = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
    if (running) {
      await Location.stopLocationUpdatesAsync(TASK_NAME);
      console.log("🛑 Restricted area watcher stopped");
    }
  }
}

export const restrictedAreaWatcher = new RestrictedAreaWatcher();
