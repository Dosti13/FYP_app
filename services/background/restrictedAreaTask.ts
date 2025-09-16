// services/background/restrictedAreaTask.ts
import * as TaskManager from "expo-task-manager";
import { locationService } from "../api/locationSevice";
import { notificationService } from "../api/notificationService";
import { dummyAreas } from "../../utils/dumyData";

const TASK_NAME = "RESTRICTED_AREA_TASK";

// Keep track of last restricted area state
let lastAreaId: string | null = null;
let lastNearbyId: string | null = null;

TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Task error:", error);
    return;
  }

  const { locations } = data as any;
  
  if (!locations?.length) return;

  const { latitude, longitude } = locations[0].coords;

  let currentArea: string | null = null;
  let currentNearby: string | null = null;

  for (const area of dummyAreas) {
    const distance = locationService.calculateDistance(
      latitude,
      longitude,
      area.coordinates.latitude,
      area.coordinates.longitude
    );

    // ✅ Inside restricted area
    if (distance <= area.radius) {
      currentArea = area.id;

      if (lastAreaId !== area.id) {
        await notificationService.sendGeofencingAlert(
          area.name,
          area.riskLevel as "HIGH" | "MEDIUM" | "LOW",
          `⚠️ You entered restricted area: ${area.name}`,
          { latitude, longitude, areaId: area.id }
        );
      }
      break;
    }

    // ✅ Near restricted area (200m buffer)
    if (distance <= area.radius + 200) {
      currentNearby = area.id;

      if (lastNearbyId !== area.id) {
        await notificationService.sendGeofencingAlert(
          area.name,
          "LOW",
          `ℹ️ You are near restricted area: ${area.name}`,
          { latitude, longitude, areaId: area.id }
        );
      }
    }
  }

  // Update last states
  lastAreaId = currentArea;
  lastNearbyId = currentNearby;
});

export { TASK_NAME };
