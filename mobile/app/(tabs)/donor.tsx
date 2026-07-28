import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MobilePage, RouteListItem, SectionHeader, StatCard } from '@/components/mobile';
import { donorRoutes } from '@/constants/mobile-routes';

export default function DonorScreen() {
  return (
    <MobilePage>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>Donor / corporate</Text>
            <Text style={styles.title}>Fund, discover, and report</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons color="#24476B" name="briefcase-outline" size={24} />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Open briefs" value="8" />
          <StatCard label="NGOs listed" value="26" />
        </View>

        <SectionHeader
          title="Donor Pages"
          subtitle="Mapped from /donor routes for donors and corporate users."
        />
        <View style={styles.list}>
          {donorRoutes.map((route) => (
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
    color: '#2F6FAE',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: {
    color: '#16212B',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: '#EAF2FB',
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
