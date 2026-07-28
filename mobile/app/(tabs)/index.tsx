import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionCard, MobilePage, RoutePill, SectionHeader, StatCard } from '@/components/mobile';
import { donorRoutes, ngoRoutes } from '@/constants/mobile-routes';

export default function HomeScreen() {
  return (
    <MobilePage>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.hero}>
          <View style={styles.logoMark}>
            <Ionicons color="#FFFFFF" name="heart" size={24} />
          </View>
          <Text style={styles.eyebrow}>GivingBackNG Mobile</Text>
          <Text style={styles.title}>Manage impact work from the field.</Text>
          <Text style={styles.subtitle}>
            A mobile workspace for NGOs, donors, and corporate sponsors to track projects, funds,
            briefs, reports, and conversations.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="NGO tools" value={ngoRoutes.length.toString()} />
          <StatCard label="Donor tools" value={donorRoutes.length.toString()} />
        </View>

        <SectionHeader title="Role Workspaces" subtitle="Start with the route groups from web." />
        <View style={styles.roleGrid}>
          <ActionCard
            description="Projects, briefs, funds, messages, profile, and past project updates."
            icon="business-outline"
            title="NGO"
          />
          <ActionCard
            description="NGO discovery, briefs/projects, disbursement, reports, and settings."
            icon="briefcase-outline"
            title="Donor / Corporate"
          />
        </View>

        <SectionHeader title="Core Mobile Pages" subtitle="First screens to build out with data." />
        <View style={styles.pillList}>
          {[...ngoRoutes.slice(0, 4), ...donorRoutes.slice(0, 4)].map((route) => (
            <RoutePill key={`${route.role}-${route.name}`} icon={route.icon} label={route.name} />
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
  hero: {
    backgroundColor: '#0F3D2E',
    borderRadius: 8,
    gap: 10,
    padding: 22,
  },
  logoMark: {
    alignItems: 'center',
    backgroundColor: '#1AA36F',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  eyebrow: {
    color: '#BCEBD7',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: '#D8F3E8',
    fontSize: 15,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  roleGrid: {
    gap: 12,
  },
  pillList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
