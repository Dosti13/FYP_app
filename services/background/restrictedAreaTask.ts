import * as TaskManager from "expo-task-manager";
import { notificationService } from "../api/notificationService";
import { getCachedHeatmap } from "./heatmapCache";
import { locationService } from "../api/locationSevice";

export const TASK_NAME = "RESTRICTED_AREA_TASK";

let lastTriggeredArea: string | null = null;

TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("❌ Background task error:", error);
    return;
  }

  const location = data?.locations?.[0];
  if (!location) return;

  const { latitude, longitude } = location.coords;

  const heatmap = await getCachedHeatmap();

  if (!heatmap.length) return;

  for (const area of heatmap) {
    const distance = locationService.calculateDistance(
      latitude,
      longitude,
      Number(area.latitude),
      Number(area.longitude)
    );

    const radius = 300; // meters
    const areaKey = `${area.city}-${area.district}`;

    if (distance <= radius && lastTriggeredArea !== areaKey) {
      lastTriggeredArea = areaKey;

      const riskLevel =
        area.incident_count >= 20
          ? "HIGH"
          : area.incident_count >= 10
          ? "MEDIUM"
          : "LOW";

      await notificationService.sendGeofencingAlert(
        `${area.district}, ${area.city}`,
        riskLevel,
        `⚠️ ${area.incident_count} incidents reported nearby`
      );

      console.log("🚨 Notification sent for:", areaKey);
      break;
    }
  }
});
