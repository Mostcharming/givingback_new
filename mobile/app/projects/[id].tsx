import { Ionicons } from '@expo/vector-icons';
import { type Href, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AppScreen,
  EmptyState,
  ErrorState,
  HeroCard,
  LoadingState,
  MetricCard,
  PrimaryButton,
  SectionTitle,
  StatusPill,
} from '@/components/app-ui';
import { formatCurrency, formatDate, Palette, Radius, titleCase } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { asArray, asRecord, extractProjects, getString } from '@/lib/data';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const projectQuery = useApiQuery<unknown>('/allprojects', {
    query: { id, limit: 1, projectType: 'present' },
  });
  const project = extractProjects(projectQuery.data)[0];
  const rawProject = asRecord(asArray(asRecord(projectQuery.data).projects)[0]);
  const milestones = asArray(rawProject.milestones);
  const donor = asRecord(rawProject.donor);
  const role = session?.user.role;

  if (projectQuery.loading) {
    return <AppScreen><LoadingState label="Loading project…" /></AppScreen>;
  }
  if (projectQuery.error) {
    return (
      <AppScreen>
        <ErrorState message={projectQuery.error} onRetry={() => void projectQuery.refetch()} />
      </AppScreen>
    );
  }
  if (!project) {
    return (
      <AppScreen>
        <EmptyState
          icon="folder-open-outline"
          message="This project may have been moved or is no longer available."
          title="Project not found"
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen onRefresh={() => void projectQuery.refetch()} refreshing={projectQuery.loading}>
      <HeroCard
        eyebrow={project.category || 'Impact project'}
        icon="leaf"
        subtitle={project.description}
        title={project.title || 'Project'}>
        <View style={styles.heroRow}>
          <StatusPill status={project.status} />
          <Text style={styles.sponsor}>
            {getString(donor.name) ? `By ${getString(donor.name)}` : 'GivingBack project'}
          </Text>
        </View>
      </HeroCard>

      <View style={styles.metrics}>
        <MetricCard
          accent="green"
          icon="cash-outline"
          label="Budget"
          value={formatCurrency(project.cost)}
        />
        <MetricCard
          accent="gold"
          icon="calendar-outline"
          label="Deadline"
          value={formatDate(project.endDate || project.end_date)}
        />
      </View>

      <View style={styles.detailCard}>
        <DetailRow icon="location-outline" label="Location" value={project.state || 'Nigeria'} />
        <DetailRow icon="pricetag-outline" label="Cause" value={project.category || 'Impact'} />
        <DetailRow
          icon="time-outline"
          label="Duration"
          value={getString(rawProject.duration, 'Not specified')}
        />
        <DetailRow
          icon="people-outline"
          label="Beneficiaries"
          value={getString(rawProject.beneficiary, 'Community beneficiaries')}
        />
      </View>

      <SectionTitle
        action={
          <Pressable onPress={() => router.push(`/projects/${id}/milestones` as Href)}>
            <Text style={styles.link}>Open milestones</Text>
          </Pressable>
        }
        subtitle="Delivery targets and verification progress."
        title="Milestones"
      />
      <View style={styles.milestoneList}>
        {milestones.length === 0 ? (
          <EmptyState
            icon="flag-outline"
            message="Milestones will appear once the delivery plan is ready."
            title="No milestones yet"
          />
        ) : (
          milestones.slice(0, 4).map((item, index) => {
            const milestone = asRecord(item);
            return (
              <View key={getString(milestone.id) || String(index)} style={styles.milestone}>
                <View style={styles.milestoneNumber}>
                  <Text style={styles.milestoneNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.milestoneText}>
                  <Text style={styles.milestoneTitle}>
                    {getString(milestone.milestone ?? milestone.title, `Milestone ${index + 1}`)}
                  </Text>
                  <Text style={styles.milestoneDescription}>
                    {getString(milestone.description, 'Delivery milestone')}
                  </Text>
                </View>
                <StatusPill status={getString(milestone.status, 'pending')} />
              </View>
            );
          })
        )}
      </View>

      {role === 'donor' || role === 'corporate' ? (
        <View style={styles.actions}>
          <PrimaryButton
            icon="people-outline"
            label="Review applications"
            onPress={() => router.push(`/applications/${id}` as Href)}
          />
          <PrimaryButton
            icon="flag-outline"
            label="Manage milestones"
            onPress={() => router.push(`/projects/${id}/milestones` as Href)}
            variant="secondary"
          />
        </View>
      ) : role === 'NGO' ? (
        <PrimaryButton
          icon="cloud-upload-outline"
          label="Update a milestone"
          onPress={() => router.push(`/projects/${id}/milestones` as Href)}
        />
      ) : null}
    </AppScreen>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons color={Palette.green} name={icon} size={19} />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{titleCase(value)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  sponsor: {
    color: '#D8F4E8',
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  metrics: {
    flexDirection: 'row',
    gap: 10,
  },
  detailCard: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: 6,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  detailIcon: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  detailText: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    color: Palette.muted,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: Palette.black,
    fontSize: 14,
    fontWeight: '800',
  },
  link: {
    color: Palette.green,
    fontSize: 12,
    fontWeight: '900',
  },
  milestoneList: {
    gap: 10,
  },
  milestone: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 13,
  },
  milestoneNumber: {
    alignItems: 'center',
    backgroundColor: Palette.greenDeep,
    borderRadius: 13,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  milestoneNumberText: {
    color: Palette.white,
    fontSize: 14,
    fontWeight: '900',
  },
  milestoneText: {
    flex: 1,
    gap: 3,
  },
  milestoneTitle: {
    color: Palette.black,
    fontSize: 13,
    fontWeight: '900',
  },
  milestoneDescription: {
    color: Palette.muted,
    fontSize: 11,
  },
  actions: {
    gap: 10,
  },
});
