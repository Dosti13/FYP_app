// services/background/restrictedAreaWatcher.ts
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { TASK_NAME } from "./restrictedAreaTask";

class RestrictedAreaWatcher {
  async startWatching() {
    console.log("Starting RestrictedAreaWatcher...");
    
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Location permission not granted");
      return;
    }

    // Request background location
    const bgStatus = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus.status !== "granted") {
      console.warn("Background location permission not granted");
      return;
    }

    // Start background updates
    await Location.enableNetworkProviderAsync();
    await Location.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000, // every 5 sec
      distanceInterval: 100, // or every 100m
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Restricted Area Monitoring",
        notificationBody: "We’re monitoring your location for safety alerts.",
      },
    });

    console.log("RestrictedAreaWatcher started");
  }

  async stopWatching() {
    const running = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
    if (running) {
      await Location.stopLocationUpdatesAsync(TASK_NAME);
      console.log("RestrictedAreaWatcher stopped");
    }
  }
}

export const restrictedAreaWatcher = new RestrictedAreaWatcher();
