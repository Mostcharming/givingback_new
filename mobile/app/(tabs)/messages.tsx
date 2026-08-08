import { Ionicons } from '@expo/vector-icons';
import { type Href, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen, EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/app-ui';
import { formatDate, Palette, Radius, titleCase } from '@/constants/design';
import { useApiQuery } from '@/hooks/use-api';
import { asRecord, extractCollection, getNumber, getString } from '@/lib/data';

export default function MessagesScreen() {
  const chatsQuery = useApiQuery<unknown>('/chats');
  const [search, setSearch] = useState('');
  const chats = useMemo(() => {
    const items = extractCollection(chatsQuery.data, ['chats']);
    if (!search.trim()) return items;
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const record = asRecord(item);
      const participant = asRecord(record.otherParticipant);
      return (
        getString(participant.name).toLowerCase().includes(term) ||
        getString(participant.email).toLowerCase().includes(term)
      );
    });
  }, [chatsQuery.data, search]);

  return (
    <AppScreen onRefresh={() => void chatsQuery.refetch()} refreshing={chatsQuery.loading}>
      <PageHeader
        eyebrow="Collaboration"
        subtitle="Keep decisions, questions, and milestone feedback beside the work."
        title="Messages"
      />
      <View style={styles.search}>
        <Ionicons color={Palette.muted} name="search-outline" size={19} />
        <TextInput
          onChangeText={setSearch}
          placeholder="Search conversations"
          placeholderTextColor={Palette.mutedLight}
          style={styles.searchInput}
          value={search}
        />
      </View>

      {chatsQuery.loading ? (
        <LoadingState label="Loading conversations…" />
      ) : chatsQuery.error ? (
        <ErrorState message={chatsQuery.error} onRetry={() => void chatsQuery.refetch()} />
      ) : chats.length === 0 ? (
        <EmptyState
          icon="chatbubbles-outline"
          message="Conversations with donors, NGOs, and administrators will appear here."
          title="No conversations yet"
        />
      ) : (
        <View style={styles.chatList}>
          {chats.map((item, index) => {
            const chat = asRecord(item);
            const participant = asRecord(chat.otherParticipant);
            const lastMessage = asRecord(chat.lastMessage);
            const id = getString(chat.id) || String(getNumber(chat.id, index));
            const unread = getNumber(chat.unreadCount);
            const name =
              getString(participant.name) ||
              getString(participant.email) ||
              titleCase(getString(participant.userType, 'GivingBack'));
            const preview =
              getString(lastMessage.message) ||
              getString(chat.lastMessage) ||
              'Open the conversation';
            return (
              <Pressable
                key={id}
                onPress={() => router.push(`/chats/${id}` as Href)}
                style={({ pressed }) => [styles.chat, pressed && styles.pressed]}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{name.slice(0, 1).toUpperCase()}</Text>
                  <View style={styles.onlineDot} />
                </View>
                <View style={styles.chatText}>
                  <View style={styles.chatTitleRow}>
                    <Text numberOfLines={1} style={styles.chatName}>{name}</Text>
                    <Text style={styles.chatTime}>
                      {formatDate(getString(chat.updatedAt ?? chat.updated_at))}
                    </Text>
                  </View>
                  <View style={styles.chatPreviewRow}>
                    <Text numberOfLines={1} style={styles.chatPreview}>{preview}</Text>
                    {unread > 0 ? (
                      <View style={styles.unread}>
                        <Text style={styles.unreadText}>{unread > 99 ? '99+' : unread}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  search: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.input,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    minHeight: 52,
    paddingHorizontal: 15,
  },
  searchInput: {
    color: Palette.black,
    flex: 1,
    fontSize: 14,
  },
  chatList: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chat: {
    alignItems: 'center',
    borderBottomColor: Palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: {
    color: Palette.green,
    fontSize: 18,
    fontWeight: '900',
  },
  onlineDot: {
    backgroundColor: Palette.greenBright,
    borderColor: Palette.white,
    borderRadius: 6,
    borderWidth: 2,
    bottom: 0,
    height: 11,
    position: 'absolute',
    right: 0,
    width: 11,
  },
  chatText: {
    flex: 1,
    gap: 6,
  },
  chatTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  chatName: {
    color: Palette.black,
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
  },
  chatTime: {
    color: Palette.mutedLight,
    fontSize: 10,
  },
  chatPreviewRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  chatPreview: {
    color: Palette.muted,
    flex: 1,
    fontSize: 12,
  },
  unread: {
    alignItems: 'center',
    backgroundColor: Palette.green,
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 20,
    minWidth: 20,
    paddingHorizontal: 5,
  },
  unreadText: {
    color: Palette.white,
    fontSize: 9,
    fontWeight: '900',
  },
  pressed: {
    backgroundColor: Palette.greenSoft,
  },
});
