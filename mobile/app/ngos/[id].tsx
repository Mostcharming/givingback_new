import { type Href, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen, EmptyState, HeroCard, InlineNotice, LoadingState, PrimaryButton, SectionTitle, StatusPill } from '@/components/app-ui';
import { Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { apiPost } from '@/lib/api';
import { asArray, asRecord, extractCollection, getString } from '@/lib/data';

export default function NgoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const ngoQuery = useApiQuery<unknown>('/donor/users', { query: { organization_id: id } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const ngo = asRecord(extractCollection(ngoQuery.data, ['users'])[0]);
  const address = asRecord(asArray(ngo.address)[0]);
  const name = getString(ngo.name, 'Impact organization');

  const startChat = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiPost<{ chat: { id: string | number } }>(
        '/chats',
        { otherUserId: ngo.user_id, otherUserType: 'ngo' },
        session?.token,
      );
      router.push(`/chats/${response.chat.id}` as Href);
    } catch (chatError) {
      setError(chatError instanceof Error ? chatError.message : 'Unable to start conversation');
    } finally {
      setLoading(false);
    }
  };

  if (ngoQuery.loading) return <AppScreen><LoadingState label="Loading organization…" /></AppScreen>;
  if (!ngo.id) return <AppScreen><EmptyState icon="business-outline" message="This organization is not available." title="NGO not found" /></AppScreen>;

  return (
    <AppScreen>
      <HeroCard eyebrow="Verified impact partner" icon="business" subtitle={getString(ngo.interest_area, 'Community development')} title={name}>
        <View style={styles.status}><StatusPill status={ngo.active ? 'verified' : 'review'} /></View>
      </HeroCard>
      {error ? <InlineNotice message={error} tone="danger" /> : null}
      <View style={styles.card}>
        <Info label="Email" value={getString(ngo.email, 'Not shared')} />
        <Info label="Phone" value={getString(ngo.phone, 'Not shared')} />
        <Info label="Website" value={getString(ngo.website, 'Not provided')} />
        <Info label="Location" value={[getString(address.city_lga), getString(address.state)].filter(Boolean).join(', ') || 'Nigeria'} />
        <Info label="CAC registration" value={getString(ngo.cac, 'On file')} />
      </View>
      <SectionTitle subtitle="Projects completed by this organization." title="Track record" />
      <EmptyState icon="ribbon-outline" message="Verified portfolio projects and completion evidence will appear here." title="Portfolio loading soon" />
      {session?.user.role !== 'NGO' ? (
        <PrimaryButton icon="chatbubble-ellipses-outline" label="Message this NGO" loading={loading} onPress={startChat} />
      ) : null}
    </AppScreen>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <View style={styles.info}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  status: { marginTop: 10 },
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: 7,
  },
  info: { borderBottomColor: Palette.border, borderBottomWidth: StyleSheet.hairlineWidth, gap: 3, padding: 12 },
  label: { color: Palette.muted, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  value: { color: Palette.black, fontSize: 14, fontWeight: '800' },
});
