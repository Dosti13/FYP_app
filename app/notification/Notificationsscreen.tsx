import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications, AppNotification, NotificationType } from '../../hooks/Notificationcontext';

const TYPE_META: Record<NotificationType, { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }> = {
  emergency:     { icon: 'warning',           color: '#dc2626', label: 'Emergency' },
  geofencing:    { icon: 'location',           color: '#f97316', label: 'Location Alert' },
  report_update: { icon: 'document-text',      color: '#2563eb', label: 'Report Update' },
  success:       { icon: 'checkmark-circle',   color: '#16a34a', label: 'Success' },
  warning:       { icon: 'alert-circle',       color: '#d97706', label: 'Warning' },
  general:       { icon: 'notifications',      color: '#6b7280', label: 'General' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NotifItem({
  item,
  onRead,
  onDelete,
}: {
  item: AppNotification;
  onRead: () => void;
  onDelete: () => void;
}) {
  const meta = TYPE_META[item.type] ?? TYPE_META.general;

  return (
    <TouchableOpacity
      style={[styles.item, !item.read && styles.itemUnread]}
      onPress={onRead}
      activeOpacity={0.8}
    >
      <View style={[styles.iconBadge, { backgroundColor: meta.color + '18' }]}>
        <Ionicons name={meta.icon} size={20} color={meta.color} />
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemTitle, !item.read && styles.itemTitleUnread]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemTime}>{timeAgo(item.timestamp)}</Text>
        </View>
        <Text style={styles.itemBody} numberOfLines={2}>{item.body}</Text>
        <Text style={[styles.itemType, { color: meta.color }]}>{meta.label}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
      <TouchableOpacity
        onPress={onDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.deleteBtn}
      >
        <Ionicons name="trash-outline" size={16} color="#9ca3af" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

type FilterType = 'all' | NotificationType;
const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'emergency', label: 'Emergency' },
  { key: 'geofencing', label: 'Location' },
  { key: 'report_update', label: 'Reports' },
  { key: 'general', label: 'General' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } =
    useNotifications();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered =
    filter === 'all'
      ? notifications
      : notifications.filter(n => n.type === filter);

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Delete all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearAll },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.headerBtn}>
              <Ionicons name="checkmark-done" size={20} color="#22c55e" />
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.headerBtn}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Ionicons name="ellipse" size={8} color="#22c55e" />
          <Text style={styles.unreadBannerText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={52} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptyBody}>
            {filter !== 'all' ? 'No notifications in this category.' : 'You\'re all caught up!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NotifItem
              item={item}
              onRead={() => markAsRead(item.id)}
              onDelete={() => deleteNotification(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: '#1f2937' },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { padding: 6 },

  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0fdf4',
    borderBottomWidth: 1,
    borderBottomColor: '#dcfce7',
  },
  unreadBannerText: { flex: 1, fontSize: 13, color: '#15803d' },
  markAllText: { fontSize: 13, color: '#22c55e', fontWeight: '600' },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterChipActive: { backgroundColor: '#22c55e' },
  filterText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  filterTextActive: { color: '#fff' },

  list: { paddingVertical: 8, paddingHorizontal: 12 },

  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemUnread: {
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  itemContent: { flex: 1 },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  itemTitle: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginRight: 8,
  },
  itemTitleUnread: { fontWeight: '700', color: '#111827' },
  itemTime: { fontSize: 11, color: '#9ca3af' },
  itemBody: { fontSize: 13, color: '#6b7280', lineHeight: 18, marginBottom: 4 },
  itemType: { fontSize: 11, fontWeight: '600' },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginTop: 4,
    flexShrink: 0,
  },
  deleteBtn: { padding: 4, marginLeft: 2, flexShrink: 0 },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: '#9ca3af', marginTop: 16, marginBottom: 6 },
  emptyBody: { fontSize: 14, color: '#d1d5db', textAlign: 'center', lineHeight: 20 },
});