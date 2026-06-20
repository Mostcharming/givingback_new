import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function MobilePage({ children }: PropsWithChildren) {
  return (
    <ScrollView contentContainerStyle={styles.pageContent} style={styles.page}>
      {children}
    </ScrollView>
  );
}

export function SectionHeader({ subtitle, title }: { subtitle?: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function ActionCard({
  description,
  icon,
  title,
}: {
  description: string;
  icon: IconName;
  title: string;
}) {
  return (
    <View style={styles.actionCard}>
      <View style={styles.iconShell}>
        <Ionicons color="#116B4D" name={icon} size={22} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </View>
  );
}

export function RouteListItem({
  description,
  icon,
  label,
  path,
}: {
  description: string;
  icon: IconName;
  label: string;
  path: string;
}) {
  return (
    <View style={styles.routeItem}>
      <View style={styles.routeIcon}>
        <Ionicons color="#116B4D" name={icon} size={20} />
      </View>
      <View style={styles.routeContent}>
        <Text style={styles.routeLabel}>{label}</Text>
        <Text style={styles.routeDescription}>{description}</Text>
        <Text style={styles.routePath}>{path}</Text>
      </View>
      <Ionicons color="#8DA399" name="chevron-forward" size={18} />
    </View>
  );
}

export function RoutePill({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.routePill}>
      <Ionicons color="#116B4D" name={icon} size={16} />
      <Text style={styles.routePillText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F7FAF7',
    flex: 1,
  },
  pageContent: {
    paddingHorizontal: 18,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    color: '#16251F',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#62736A',
    fontSize: 14,
    lineHeight: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E9E4',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 16,
  },
  statValue: {
    color: '#116B4D',
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    color: '#52655B',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  actionCard: {
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E9E4',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  iconShell: {
    alignItems: 'center',
    backgroundColor: '#E9F8F0',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: '#16251F',
    fontSize: 16,
    fontWeight: '800',
  },
  cardDescription: {
    color: '#52655B',
    fontSize: 14,
    lineHeight: 20,
  },
  routeItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E9E4',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  routeIcon: {
    alignItems: 'center',
    backgroundColor: '#E9F8F0',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  routeContent: {
    flex: 1,
    gap: 3,
  },
  routeLabel: {
    color: '#16251F',
    fontSize: 15,
    fontWeight: '800',
  },
  routeDescription: {
    color: '#52655B',
    fontSize: 13,
    lineHeight: 18,
  },
  routePath: {
    color: '#8DA399',
    fontSize: 12,
    fontWeight: '700',
  },
  routePill: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E9E4',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  routePillText: {
    color: '#273A31',
    fontSize: 13,
    fontWeight: '700',
  },
});
