import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState, ErrorState, LoadingState } from '@/components/app-ui';
import { formatDate, Palette, Radius, Shadow } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { apiPost, apiPut } from '@/lib/api';
import { asRecord, extractCollection, getNumber, getString } from '@/lib/data';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const messagesQuery = useApiQuery<unknown>(`/chats/${id}/messages`);
  const chatsQuery = useApiQuery<unknown>('/chats');
  const refetchMessages = messagesQuery.refetch;
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const messages = extractCollection(messagesQuery.data, ['messages']);
  const chat = useMemo(
    () =>
      extractCollection(chatsQuery.data, ['chats'])
        .map(asRecord)
        .find((item) => String(item.id) === String(id)),
    [chatsQuery.data, id],
  );
  const participant = asRecord(chat?.otherParticipant);
  const title = getString(participant.name) || getString(participant.email) || 'Conversation';

  useEffect(() => {
    if (!id || !session?.token) return;
    void apiPut(`/chats/${id}/mark-as-read`, {}, session.token).catch(() => undefined);
  }, [id, session?.token, messages.length]);

  useEffect(() => {
    const timer = setInterval(() => void refetchMessages(), 12000);
    return () => clearInterval(timer);
  }, [refetchMessages]);

  const send = async () => {
    const body = message.trim();
    if (!body || sending) return;
    setSending(true);
    setMessage('');
    try {
      await apiPost(`/chats/${id}/messages`, { attachments: [], message: body }, session?.token);
      await messagesQuery.refetch();
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    } catch {
      setMessage(body);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        style={styles.keyboard}>
        <View style={styles.person}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{title.slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={styles.personText}>
            <Text numberOfLines={1} style={styles.name}>{title}</Text>
            <Text style={styles.presence}>GivingBack secure conversation</Text>
          </View>
          <Ionicons color={Palette.green} name="shield-checkmark" size={21} />
        </View>

        {messagesQuery.loading ? (
          <View style={styles.state}><LoadingState label="Loading messages..." /></View>
        ) : messagesQuery.error ? (
          <View style={styles.state}><ErrorState message={messagesQuery.error} onRetry={() => void messagesQuery.refetch()} /></View>
        ) : messages.length === 0 ? (
          <View style={styles.state}>
            <EmptyState icon="chatbubble-ellipses-outline" message="Start with a question, an update, or a friendly hello." title="Start the conversation" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.messages}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
            ref={scrollRef}
            showsVerticalScrollIndicator={false}>
            <View style={styles.datePill}><Text style={styles.dateText}>Project conversation</Text></View>
            {messages.map((item, index) => {
              const record = asRecord(item);
              const mine = getNumber(record.sender_user_id ?? record.senderUserId) === session?.user.id;
              return (
                <View key={getString(record.id) || String(index)} style={[styles.bubbleRow, mine && styles.bubbleRowMine]}>
                  <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
                    <Text style={[styles.messageText, mine && styles.messageTextMine]}>
                      {getString(record.message)}
                    </Text>
                    <View style={styles.messageMeta}>
                      <Text style={[styles.time, mine && styles.timeMine]}>
                        {formatDate(getString(record.created_at ?? record.createdAt))}
                      </Text>
                      {mine ? <Ionicons color="#BDEDD9" name="checkmark-done" size={14} /> : null}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        <View style={styles.composer}>
          <Pressable accessibilityLabel="Add attachment" style={styles.attach}>
            <Ionicons color={Palette.green} name="add" size={23} />
          </Pressable>
          <TextInput
            multiline
            onChangeText={setMessage}
            placeholder="Write a message..."
            placeholderTextColor={Palette.mutedLight}
            style={styles.input}
            value={message}
          />
          <Pressable
            accessibilityLabel="Send message"
            disabled={!message.trim() || sending}
            onPress={() => void send()}
            style={[styles.send, (!message.trim() || sending) && styles.sendDisabled]}>
            {sending ? <ActivityIndicator color={Palette.white} size="small" /> : <Ionicons color={Palette.white} name="arrow-up" size={20} />}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: Palette.background, flex: 1 },
  keyboard: { flex: 1 },
  person: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderBottomColor: Palette.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 11,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: Palette.greenDeep,
    borderRadius: 19,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  avatarText: { color: Palette.white, fontSize: 16, fontWeight: '900' },
  personText: { flex: 1, gap: 2 },
  name: { color: Palette.black, fontSize: 15, fontWeight: '900' },
  presence: { color: Palette.muted, fontSize: 10 },
  state: { flex: 1, justifyContent: 'center', padding: 18 },
  messages: { gap: 8, padding: 18, paddingBottom: 28 },
  datePill: {
    alignSelf: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: Radius.pill,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateText: { color: Palette.green, fontSize: 10, fontWeight: '800' },
  bubbleRow: { alignItems: 'flex-start' },
  bubbleRowMine: { alignItems: 'flex-end' },
  bubble: { borderRadius: 20, gap: 5, maxWidth: '82%', paddingHorizontal: 14, paddingVertical: 11 },
  bubbleMine: { backgroundColor: Palette.greenDeep, borderBottomRightRadius: 6 },
  bubbleOther: {
    backgroundColor: Palette.white,
    borderBottomLeftRadius: 6,
    borderColor: Palette.border,
    borderWidth: 1,
  },
  messageText: { color: Palette.black, fontSize: 14, lineHeight: 20 },
  messageTextMine: { color: Palette.white },
  messageMeta: { alignItems: 'center', alignSelf: 'flex-end', flexDirection: 'row', gap: 4 },
  time: { color: Palette.mutedLight, fontSize: 8 },
  timeMine: { color: '#BDEDD9' },
  composer: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopColor: Palette.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 9,
    padding: 12,
  },
  attach: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 20,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  input: {
    backgroundColor: Palette.background,
    borderColor: Palette.border,
    borderRadius: 20,
    borderWidth: 1,
    color: Palette.black,
    flex: 1,
    fontSize: 14,
    maxHeight: 110,
    minHeight: 44,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  send: {
    alignItems: 'center',
    backgroundColor: Palette.green,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
    ...Shadow.card,
  },
  sendDisabled: { opacity: 0.4 },
});
