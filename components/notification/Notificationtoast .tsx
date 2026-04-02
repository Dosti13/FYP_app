import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppNotification, NotificationType } from '../../hooks/Notificationcontext';

interface ToastProps {
  notification: AppNotification | null;
  onDismiss: () => void;
  onPress?: () => void;
}

const TYPE_CONFIG: Record<NotificationType, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  emergency:     { icon: 'warning',           color: '#fff',    bg: '#dc2626' },
  geofencing:    { icon: 'location',           color: '#fff',    bg: '#f97316' },
  report_update: { icon: 'document-text',      color: '#fff',    bg: '#2563eb' },
  success:       { icon: 'checkmark-circle',   color: '#fff',    bg: '#16a34a' },
  warning:       { icon: 'alert-circle',       color: '#fff',    bg: '#d97706' },
  general:       { icon: 'notifications',      color: '#fff',    bg: '#6b7280' },
};

const TOAST_DURATION = 4000;

export function NotificationToast({ notification, onDismiss, onPress }: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!notification) return;

    // Slide in
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 65,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss
    timerRef.current = setTimeout(() => {
      dismiss();
    }, TOAST_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [notification?.id]);

  const dismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!notification) return null;

  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.general;

  return (
    <Animated.View
      style={[
        styles.container,
        { top: insets.top + 8, transform: [{ translateY }], opacity },
      ]}
    >
      <TouchableOpacity
        style={[styles.toast, { backgroundColor: config.bg }]}
        onPress={() => { dismiss(); onPress?.(); }}
        activeOpacity={0.92}
      >
        <View style={styles.iconWrap}>
          <Ionicons name={config.icon} size={22} color={config.color} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
          <Text style={styles.body} numberOfLines={2}>{notification.body}</Text>
        </View>
        <TouchableOpacity onPress={dismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={18} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  body: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 17,
  },
});