import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { useNotifications } from "../../hooks/Notificationcontext";

interface NotificationBellProps {
  color?: string;
  size?: number;
  showPulse?: boolean;
}

export function NotificationBell({
  color = "#1f2937",
  size = 24,
  showPulse = true,
}: NotificationBellProps) {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for unread notifications
  useEffect(() => {
    if (showPulse && unreadCount > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [unreadCount, showPulse, pulseAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    router.push("/notification/Notificationsscreen");
  };

  const hasNotifications = unreadCount > 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.6}
    >
      <Animated.View
        style={[
          styles.bellIcon,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Ionicons
          name={hasNotifications ? "notifications" : "notifications-outline"}
          size={size}
          color={hasNotifications ? "#ef4444" : color}
        />
      </Animated.View>

      {/* Pulse ring effect */}
      {hasNotifications && showPulse && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.2],
                outputRange: [1, 0],
              }),
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}

      {/* Badge */}
      {hasNotifications && (
        <Animated.View
          style={[
            styles.badgeContainer,
            {
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.2],
                    outputRange: [1, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </View>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  bellIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#ef4444",
  },
  badgeContainer: {
    position: "absolute",
    top: -6,
    right: -6,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 2.5,
    borderColor: "#fff",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 14,
    textAlign: "center",
  },
});
