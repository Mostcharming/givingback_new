import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MobilePage, RouteListItem, SectionHeader, StatCard } from '@/components/mobile';
import { ngoRoutes } from '@/constants/mobile-routes';

export default function NgoScreen() {
  return (
    <MobilePage>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>NGO workspace</Text>
            <Text style={styles.title}>Projects, briefs, and funds</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons color="#0F3D2E" name="business-outline" size={24} />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Active projects" value="12" />
          <StatCard label="Briefs waiting" value="4" />
        </View>

        <SectionHeader title="NGO Pages" subtitle="Mapped from /ngo routes in the web client." />
        <View style={styles.list}>
          {ngoRoutes.map((route) => (
            <RouteListItem
              description={route.description}
              icon={route.icon}
              key={route.path}
              label={route.name}
              path={route.path}
            />
          ))}
        </View>
      </SafeAreaView>
    </MobilePage>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    gap: 20,
    paddingBottom: 28,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  kicker: {
    color: '#1AA36F',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: {
    color: '#16251F',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: '#E9F8F0',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  list: {
    gap: 10,
  },
});
