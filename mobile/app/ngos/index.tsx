import { type Href, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppScreen, EmptyState, ErrorState, LoadingState, PageHeader, StatusPill } from '@/components/app-ui';
import { Palette, Radius } from '@/constants/design';
import { useApiQuery } from '@/hooks/use-api';
import { asRecord, extractCollection, getString } from '@/lib/data';

export default function NgoDirectoryScreen() {
  const directory = useApiQuery<unknown>('/donor/users', { query: { all: true } });
  const [search, setSearch] = useState('');
  const organizations = useMemo(() => {
    const items = extractCollection(directory.data, ['users', 'organizations']);
    if (!search.trim()) return items;
    const term = search.toLowerCase();
    return items.filter((item) => {
      const record = asRecord(item);
      return getString(record.name).toLowerCase().includes(term) || getString(record.interest_area).toLowerCase().includes(term);
    });
  }, [directory.data, search]);

  return (
    <AppScreen onRefresh={() => void directory.refetch()} refreshing={directory.loading}>
      <PageHeader eyebrow="Verified partners" subtitle="Discover organizations by focus area, location, and experience." title="NGO directory" />
      <View style={styles.search}>
        <Ionicons color={Palette.muted} name="search-outline" size={19} />
        <TextInput onChangeText={setSearch} placeholder="Search NGOs or impact areas" placeholderTextColor={Palette.mutedLight} style={styles.searchInput} value={search} />
      </View>
      {directory.loading ? <LoadingState label="Finding impact partners…" /> : directory.error ? (
        <ErrorState message={directory.error} onRetry={() => void directory.refetch()} />
      ) : organizations.length === 0 ? (
        <EmptyState icon="business-outline" message="No organizations match this search yet." title="No NGOs found" />
      ) : (
        <View style={styles.grid}>
          {organizations.map((item, index) => {
            const organization = asRecord(item);
            const id = getString(organization.id) || String(index);
            const name = getString(organization.name, 'Impact organization');
            return (
              <Pressable key={id} onPress={() => router.push(`/ngos/${id}` as Href)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
                <View style={styles.cardTop}>
                  <View style={styles.logo}><Text style={styles.logoText}>{name.slice(0, 1).toUpperCase()}</Text></View>
                  <StatusPill status={organization.active ? 'verified' : 'review'} />
                </View>
                <Text style={styles.name}>{name}</Text>
                <Text numberOfLines={2} style={styles.focus}>{getString(organization.interest_area, 'Community development')}</Text>
                <View style={styles.location}>
                  <Ionicons color={Palette.muted} name="location-outline" size={15} />
                  <Text style={styles.locationText}>{getString(asRecord(asRecord(organization).address).state, 'Nigeria')}</Text>
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
    paddingHorizontal: 14,
  },
  searchInput: { color: Palette.black, flex: 1, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 9,
    minHeight: 190,
    padding: 15,
    width: '48.5%',
  },
  cardTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  logo: {
    alignItems: 'center',
    backgroundColor: Palette.greenDeep,
    borderRadius: 17,
    height: 45,
    justifyContent: 'center',
    width: 45,
  },
  logoText: { color: Palette.white, fontSize: 18, fontWeight: '900' },
  name: { color: Palette.black, fontSize: 15, fontWeight: '900', lineHeight: 19 },
  focus: { color: Palette.muted, fontSize: 12, lineHeight: 17 },
  location: { alignItems: 'center', flexDirection: 'row', gap: 5, marginTop: 'auto' },
  locationText: { color: Palette.muted, fontSize: 11, fontWeight: '700' },
  pressed: { opacity: 0.76 },
});
