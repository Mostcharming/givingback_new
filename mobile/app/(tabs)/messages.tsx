import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionCard, MobilePage, SectionHeader } from '@/components/mobile';

const inboxItems = [
  {
    description: 'Keep donors, corporate sponsors, NGOs, and admins in one project thread.',
    icon: 'chatbubbles-outline' as const,
    title: 'Project messages',
  },
  {
    description: 'Surface brief responses, milestone comments, and funding updates.',
    icon: 'notifications-outline' as const,
    title: 'Notifications',
  },
  {
    description: 'Give teams a quick path to profile, security, support, and bank details.',
    icon: 'settings-outline' as const,
    title: 'Settings',
  },
];

export default function MessagesScreen() {
  return (
    <MobilePage>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Shared pages</Text>
          <Text style={styles.title}>Messages and account actions</Text>
          <Text style={styles.subtitle}>
            These pages are common to NGO and donor/corporate users, so they can be built once and
            adapted by role permissions.
          </Text>
        </View>

        <SectionHeader title="Build Next" subtitle="Common screens from both mobile workspaces." />
        <View style={styles.list}>
          {inboxItems.map((item) => (
            <ActionCard
              description={item.description}
              icon={item.icon}
              key={item.title}
              title={item.title}
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
    gap: 8,
  },
  kicker: {
    color: '#8C5A12',
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    color: '#261C10',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: '#62584D',
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    gap: 12,
  },
});
