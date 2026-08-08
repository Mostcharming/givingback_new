import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, EmptyState, ErrorState, LoadingState, PageHeader, TextButton } from '@/components/app-ui';
import { formatDate, Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { apiDelete, apiPut } from '@/lib/api';
import { asRecord, extractCollection, getString } from '@/lib/data';

export default function NotificationsScreen() {
  const { session } = useAuth();
  const role = session?.user.role;
  const path = role === 'NGO'
    ? '/notifications/ngo/notifications'
    : role === 'admin'
      ? '/notifications/admin/notifications'
      : '/notifications/donor-corporate/notifications';
  const notifications = useApiQuery<unknown>(path);
  const [workingId, setWorkingId] = useState('');
  const items = extractCollection(notifications.data, ['data', 'notifications']);

  const markRead = async (id: string) => {
    setWorkingId(id);
    try {
      await apiPut(`/notifications/notifications/${id}/read`, {}, session?.token);
      void notifications.refetch();
    } finally {
      setWorkingId('');
    }
  };

  const clearAll = () => {
    Alert.alert('Clear notifications?', 'This removes all notifications from your account.', [
      { style: 'cancel', text: 'Keep them' },
      {
        onPress: async () => {
          await apiDelete('/notifications/notifications', undefined, session?.token);
          void notifications.refetch();
        },
        style: 'destructive',
        text: 'Clear all',
      },
    ]);
  };

  return (
    <AppScreen onRefresh={() => void notifications.refetch()} refreshing={notifications.loading}>
      <PageHeader
        action={items.length ? <TextButton label="Clear all" onPress={clearAll} /> : undefined}
        eyebrow="Activity"
        subtitle="Funding, applications, approvals, and milestone updates in one place."
        title="Notifications"
      />
      {notifications.loading ? (
        <LoadingState label="Loading notifications..." />
      ) : notifications.error ? (
        <ErrorState message={notifications.error} onRetry={() => void notifications.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState icon="notifications-off-outline" message="You are all caught up. New activity will appear here." title="Nothing new" />
      ) : (
        <View style={styles.list}>
          {items.map((item, index) => {
            const record = asRecord(item);
            const id = getString(record.id) || String(index);
            const unread = getString(record.status, 'unread') !== 'read';
            return (
              <Pressable
                disabled={!unread || workingId === id}
                key={id}
                onPress={() => void markRead(id)}
                style={({ pressed }) => [styles.item, unread && styles.itemUnread, pressed && styles.pressed]}>
                <View style={[styles.icon, unread && styles.iconUnread]}>
                  <Ionicons color={unread ? Palette.green : Palette.muted} name={notificationIcon(getString(record.type))} size={21} />
                </View>
                <View style={styles.text}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{getString(record.title, 'GivingBack update')}</Text>
                    {unread ? <View style={styles.dot} /> : null}
                  </View>
                  <Text style={styles.message}>{getString(record.message ?? record.description, 'Open to see the latest activity.')}</Text>
                  <Text style={styles.date}>{formatDate(getString(record.created_at ?? record.createdAt))}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </AppScreen>
  );
}

function notificationIcon(type: string): keyof typeof Ionicons.glyphMap {
  const normalized = type.toLowerCase();
  if (normalized.includes('payment') || normalized.includes('fund')) return 'wallet-outline';
  if (normalized.includes('milestone')) return 'flag-outline';
  if (normalized.includes('application')) return 'document-text-outline';
  if (normalized.includes('message')) return 'chatbubble-outline';
  return 'sparkles-outline';
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  item: {
    alignItems: 'flex-start',
    borderBottomColor: Palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    padding: 15,
  },
  itemUnread: { backgroundColor: '#F4FCF8' },
  icon: {
    alignItems: 'center',
    backgroundColor: Palette.background,
    borderRadius: 16,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  iconUnread: { backgroundColor: Palette.greenSoft },
  text: { flex: 1, gap: 5 },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  title: { color: Palette.black, flex: 1, fontSize: 14, fontWeight: '900' },
  dot: { backgroundColor: Palette.greenBright, borderRadius: 5, height: 8, width: 8 },
  message: { color: Palette.muted, fontSize: 12, lineHeight: 18 },
  date: { color: Palette.mutedLight, fontSize: 9, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
