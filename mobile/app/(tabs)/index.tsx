import { Ionicons } from '@expo/vector-icons';
import { type Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AppScreen,
  ErrorState,
  HeroCard,
  LoadingState,
  MetricCard,
  PageHeader,
  ProjectCard,
  QuickAction,
  SectionTitle,
} from '@/components/app-ui';
import { formatCurrency, Palette, titleCase } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { asRecord, extractProjects, getMetricValue, getString } from '@/lib/data';

function navigate(path: string) {
  router.push(path as Href);
}

export default function DashboardScreen() {
  const { session } = useAuth();
  const role = session?.user.role || 'donor';
  const isAdmin = role === 'admin';
  const isNgo = role === 'NGO';
  const dashboardPath = isAdmin ? '/admin/dashboard' : '/donor/dashboard';
  const dashboard = useApiQuery<unknown>(dashboardPath);
  const profile = useApiQuery<unknown>('/auth');
  const projectPath = role === 'donor' || role === 'corporate' ? '/auth/donor/projects' : '/allprojects';
  const recentProjects = useApiQuery<unknown>(projectPath, {
    query: role === 'NGO' ? { limit: 3, status: 'brief' } : { limit: 3, projectType: 'present' },
  });

  const dashboardData = asRecord(dashboard.data);
  const profileData = asRecord(profile.data);
  const account = asRecord(profileData.user);
  const projects = extractProjects(recentProjects.data).slice(0, 3);
  const displayName = getString(account.name) || session?.user.email.split('@')[0] || 'there';

  const metrics = isNgo
    ? [
        ['Projects completed', getMetricValue(dashboardData, 'completedProjectsCount'), 'checkmark-done-circle-outline', 'green'],
        ['Active projects', getMetricValue(dashboardData, 'activeProjectsCount'), 'rocket-outline', 'blue'],
        ['Donations received', getMetricValue(dashboardData, 'totalDonations'), 'cash-outline', 'gold'],
        ['Applications', getMetricValue(dashboardData, 'applicationsCount'), 'document-text-outline', 'purple'],
      ]
    : isAdmin
      ? [
          ['Registered NGOs', getMetricValue(dashboardData, 'ngoUsersCount'), 'business-outline', 'green'],
          ['Pending requests', getMetricValue(dashboardData, 'pendingRequests'), 'time-outline', 'gold'],
          ['Project funding', getMetricValue(dashboardData, 'donationCount'), 'cash-outline', 'blue'],
          ['Platform users', getMetricValue(dashboardData, 'usersCount'), 'people-outline', 'purple'],
        ]
      : [
          ['Funds disbursed', getMetricValue(dashboardData, 'totalFundDisbursed'), 'wallet-outline', 'green'],
          ['NGOs onboarded', getMetricValue(dashboardData, 'ngosOnboarded'), 'people-outline', 'purple'],
          ['Active projects', getMetricValue(dashboardData, 'activeProjects'), 'rocket-outline', 'blue'],
          ['Beneficiaries', getMetricValue(dashboardData, 'totalBeneficiaries'), 'heart-outline', 'gold'],
        ];

  const refresh = () => {
    void Promise.all([dashboard.refetch(), profile.refetch(), recentProjects.refetch()]);
  };

  return (
    <AppScreen
      onRefresh={refresh}
      refreshing={dashboard.loading || profile.loading || recentProjects.loading}>
      <PageHeader
        action={
          <Pressable onPress={() => navigate('/notifications')} style={styles.notificationButton}>
            <Ionicons color={Palette.greenDeep} name="notifications-outline" size={22} />
            <View style={styles.notificationDot} />
          </Pressable>
        }
        eyebrow={`${titleCase(role)} workspace`}
        subtitle="Everything moving your impact forward."
        title={`Hello, ${titleCase(displayName)}`}
      />

      <HeroCard
        eyebrow="Impact command centre"
        icon={isNgo ? 'leaf' : isAdmin ? 'analytics' : 'sparkles'}
        subtitle={
          isNgo
            ? 'Discover opportunities, deliver milestones, and keep every donor aligned.'
            : isAdmin
              ? 'Keep organizations, projects, funding, and compliance moving together.'
              : 'Turn funding into transparent projects and measurable outcomes.'
        }
        title={
          isNgo
            ? 'Good work deserves clear momentum.'
            : isAdmin
              ? 'A clear view of the whole ecosystem.'
              : 'Your giving is becoming visible impact.'
        }>
        <View style={styles.heroFooter}>
          <View>
            <Text style={styles.heroFooterLabel}>Wallet balance</Text>
            <Text style={styles.heroFooterValue}>
              {formatCurrency(asRecord(profileData.wallet).balance)}
            </Text>
          </View>
          <Pressable onPress={() => router.navigate('/(tabs)/funds')} style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Open wallet</Text>
            <Ionicons color={Palette.greenDeep} name="arrow-forward" size={16} />
          </Pressable>
        </View>
      </HeroCard>

      {dashboard.loading ? (
        <LoadingState label="Preparing your dashboard…" />
      ) : dashboard.error ? (
        <ErrorState message={dashboard.error} onRetry={() => void dashboard.refetch()} />
      ) : (
        <View style={styles.metricGrid}>
          {metrics.map(([label, value, icon, accent]) => (
            <View key={String(label)} style={styles.metricCell}>
              <MetricCard
                accent={accent as 'blue' | 'gold' | 'green' | 'purple'}
                icon={icon as keyof typeof Ionicons.glyphMap}
                label={String(label)}
                value={String(value ?? 0)}
              />
            </View>
          ))}
        </View>
      )}

      <SectionTitle subtitle="The next useful action is one tap away." title="Quick actions" />
      <View style={styles.actionGrid}>
        {isNgo ? (
          <>
            <QuickAction icon="search-outline" label="Discover new briefs" onPress={() => router.navigate('/(tabs)/projects')} />
            <QuickAction icon="cloud-upload-outline" label="Submit milestone update" onPress={() => router.navigate('/(tabs)/projects')} />
            <QuickAction icon="add-circle-outline" label="Add a past project" onPress={() => navigate('/projects/create?mode=past')} />
          </>
        ) : isAdmin ? (
          <>
            <QuickAction icon="business-outline" label="Review NGOs" onPress={() => navigate('/ngos')} />
            <QuickAction icon="folder-open-outline" label="Review projects" onPress={() => router.navigate('/(tabs)/projects')} />
            <QuickAction icon="bar-chart-outline" label="Open reports" onPress={() => navigate('/reports')} />
          </>
        ) : (
          <>
            <QuickAction icon="add-circle-outline" label="Create a project brief" onPress={() => navigate('/projects/create')} />
            <QuickAction icon="search-outline" label="Find verified NGOs" onPress={() => navigate('/ngos')} />
            <QuickAction icon="card-outline" label="Fund your wallet" onPress={() => router.navigate('/(tabs)/funds')} />
          </>
        )}
      </View>

      <SectionTitle
        action={
          <Pressable onPress={() => router.navigate('/(tabs)/projects')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        }
        subtitle={isNgo ? 'Matched opportunities and active work.' : 'Your most recently updated work.'}
        title={isNgo ? 'Opportunities' : 'Recent projects'}
      />
      <View style={styles.projectList}>
        {projects.map((project) => (
          <ProjectCard
            item={project}
            key={project.id}
            onPress={() =>
              navigate(isNgo && project.status === 'brief' ? `/briefs/${project.id}` : `/projects/${project.id}`)
            }
          />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  notificationButton: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  notificationDot: {
    backgroundColor: Palette.gold,
    borderColor: Palette.white,
    borderRadius: 5,
    borderWidth: 2,
    height: 9,
    position: 'absolute',
    right: 10,
    top: 9,
    width: 9,
  },
  heroFooter: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    padding: 12,
  },
  heroFooterLabel: {
    color: '#BDEDD9',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heroFooterValue: {
    color: Palette.white,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  heroButton: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 13,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  heroButtonText: {
    color: Palette.greenDeep,
    fontSize: 11,
    fontWeight: '900',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCell: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  actionGrid: {
    gap: 10,
  },
  seeAll: {
    color: Palette.green,
    fontSize: 13,
    fontWeight: '900',
  },
  projectList: {
    gap: 12,
  },
});
