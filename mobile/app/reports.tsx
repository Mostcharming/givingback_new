import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo, useState, type ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen, PageHeader } from '@/components/app-ui';
import { Palette, Radius, Shadow } from '@/constants/design';

type IconName = ComponentProps<typeof Ionicons>['name'];
type ReportView = 'general' | 'personal';
type LocationKey = 'all' | 'north' | 'south';

type ReportMetric = {
  accent: string;
  caption: string;
  change: string;
  icon: IconName;
  period: string;
  title: string;
  value: string;
};

type ProjectSeries = {
  beneficiaries: string;
  duration: string;
  name: string;
  values: number[];
};

type ImpactMarker = {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  type: 'beneficiary' | 'organization';
};

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoic2FmYWsiLCJhIjoiY2tubmFvdHVwMTM0bDJ2bnh3b3g5amdsYiJ9.fhCd-5dCeop0Jjn3cBV9VA';

const reportMetrics: Record<ReportView, ReportMetric[]> = {
  general: [
    {
      accent: '#128330',
      caption: 'Active organizations',
      change: '+12%',
      icon: 'people-outline',
      period: 'Since last month',
      title: 'Total NGOs',
      value: '145',
    },
    {
      accent: '#AD22D0',
      caption: 'Across all categories',
      change: '+8%',
      icon: 'trophy-outline',
      period: 'Since last quarter',
      title: 'Projects Completed',
      value: '328',
    },
    {
      accent: '#F97316',
      caption: 'Currently in progress',
      change: '+5%',
      icon: 'document-text-outline',
      period: 'Since last month',
      title: 'Active Projects',
      value: '62',
    },
    {
      accent: '#1677FF',
      caption: 'People impacted',
      change: '+15%',
      icon: 'person-add-outline',
      period: 'Annual growth',
      title: 'Beneficiaries',
      value: '1.2M',
    },
  ],
  personal: [
    {
      accent: '#128330',
      caption: 'Organizations funded',
      change: '+4%',
      icon: 'people-outline',
      period: 'Since last month',
      title: 'NGOs Supported',
      value: '18',
    },
    {
      accent: '#AD22D0',
      caption: 'Through your support',
      change: '+6%',
      icon: 'trophy-outline',
      period: 'Since last quarter',
      title: 'Projects Completed',
      value: '31',
    },
    {
      accent: '#F97316',
      caption: 'Currently in progress',
      change: '+3%',
      icon: 'document-text-outline',
      period: 'Since last month',
      title: 'Active Projects',
      value: '9',
    },
    {
      accent: '#1677FF',
      caption: 'Estimated beneficiaries',
      change: '+11%',
      icon: 'person-add-outline',
      period: 'Annual growth',
      title: 'People Reached',
      value: '48.6K',
    },
  ],
};

const projectSeries: ProjectSeries[] = [
  {
    beneficiaries: '2,500',
    duration: '7 pm',
    name: 'Gender-Based Violence',
    values: [140, 380, 840, 1320, 1670, 2250, 2430, 2390],
  },
  {
    beneficiaries: '2,680',
    duration: '9 pm',
    name: 'Primary Education',
    values: [220, 520, 730, 1080, 1490, 1820, 2140, 2680],
  },
  {
    beneficiaries: '2,320',
    duration: '9 pm',
    name: 'Maternal Health',
    values: [110, 290, 650, 980, 1430, 1750, 2060, 2320],
  },
];

const topOrganizations = [
  { location: 'Lagos', name: 'Women First Initiative', projects: 28 },
  { location: 'Abuja', name: 'Hope for Communities', projects: 24 },
  { location: 'Kano', name: 'CareBridge Nigeria', projects: 21 },
  { location: 'Enugu', name: 'Bright Future Network', projects: 19 },
];

const impactMarkers: ImpactMarker[] = [
  { id: 1, latitude: 11.4942, longitude: 4.2333, name: 'Kebbi', type: 'beneficiary' },
  { id: 2, latitude: 12.9908, longitude: 7.6018, name: 'Katsina', type: 'organization' },
  { id: 3, latitude: 12.0022, longitude: 8.592, name: 'Kano', type: 'beneficiary' },
  { id: 4, latitude: 10.3158, longitude: 9.8442, name: 'Bauchi', type: 'beneficiary' },
  { id: 5, latitude: 11.8469, longitude: 13.1571, name: 'Borno', type: 'beneficiary' },
  { id: 6, latitude: 10.5105, longitude: 7.4165, name: 'Kaduna', type: 'organization' },
  { id: 7, latitude: 9.9309, longitude: 5.5983, name: 'Niger', type: 'beneficiary' },
  { id: 8, latitude: 9.0765, longitude: 7.3986, name: 'Abuja', type: 'beneficiary' },
  { id: 9, latitude: 8.538, longitude: 8.303, name: 'Nasarawa', type: 'organization' },
  { id: 10, latitude: 9.3265, longitude: 12.3984, name: 'Adamawa', type: 'organization' },
  { id: 11, latitude: 8.9669, longitude: 4.3874, name: 'Kwara', type: 'organization' },
  { id: 12, latitude: 7.85, longitude: 3.933, name: 'Oyo', type: 'organization' },
  { id: 13, latitude: 7.5629, longitude: 4.52, name: 'Osun', type: 'beneficiary' },
  { id: 14, latitude: 7.2526, longitude: 5.1931, name: 'Ondo', type: 'organization' },
  { id: 15, latitude: 6.4584, longitude: 7.5464, name: 'Enugu', type: 'organization' },
  { id: 16, latitude: 5.704, longitude: 5.9339, name: 'Delta', type: 'beneficiary' },
  { id: 17, latitude: 5.8702, longitude: 8.5988, name: 'Cross River', type: 'beneficiary' },
];

const locations: Record<
  LocationKey,
  { label: string; latitude: number; longitude: number; zoom: number }
> = {
  all: { label: 'All locations', latitude: 8.55, longitude: 8.1, zoom: 4.8 },
  north: { label: 'Northern Nigeria', latitude: 11.1, longitude: 8.3, zoom: 5.25 },
  south: { label: 'Southern Nigeria', latitude: 6.3, longitude: 7.2, zoom: 5.5 },
};

const timeLabels = ['12a', '3a', '6a', '9a', '12p', '3p', '6p', '9p'];

function ReportMetricCard({ metric }: { metric: ReportMetric }) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeading}>
        <Text numberOfLines={1} style={styles.metricTitle}>
          {metric.title}
        </Text>
        <Ionicons color={metric.accent} name={metric.icon} size={21} />
      </View>
      <Text style={styles.metricValue}>{metric.value}</Text>
      <Text numberOfLines={1} style={styles.metricCaption}>
        {metric.caption}
      </Text>
      <View style={styles.metricTrend}>
        <Text style={styles.metricChange}>{metric.change}</Text>
        <Text numberOfLines={1} style={styles.metricPeriod}>
          {metric.period}
        </Text>
      </View>
    </View>
  );
}

function ReportTabs({ activeView, onChange }: { activeView: ReportView; onChange: (view: ReportView) => void }) {
  return (
    <View accessibilityRole="tablist" style={styles.tabs}>
      {(['general', 'personal'] as const).map((view) => {
        const active = activeView === view;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={view}
            onPress={() => onChange(view)}
            style={[styles.tab, active && styles.tabActive]}>
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {view === 'general' ? 'General' : 'Personal'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ChoicePills<T extends string>({
  active,
  onChange,
  options,
}: {
  active: T;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.choiceContent}
      horizontal
      showsHorizontalScrollIndicator={false}>
      {options.map((option) => {
        const selected = option.value === active;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.choice, selected && styles.choiceActive]}>
            <Text style={[styles.choiceText, selected && styles.choiceTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function PanelHeader({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <View style={styles.panelHeader}>
      <Text style={styles.panelTitle}>{title}</Text>
      <Text style={styles.panelSubtitle}>{subtitle}</Text>
    </View>
  );
}

function ImpactChart({ project }: { project: ProjectSeries }) {
  const maximum = Math.max(...project.values);

  return (
    <View>
      <View style={styles.chartSummary}>
        <View>
          <Text style={styles.chartSummaryLabel}>Beneficiaries</Text>
          <Text style={styles.chartSummaryValue}>{project.beneficiaries}</Text>
        </View>
        <View style={styles.chartSummaryDivider} />
        <View>
          <Text style={styles.chartSummaryLabel}>Peak time</Text>
          <Text style={styles.chartSummaryValue}>{project.duration}</Text>
        </View>
      </View>

      <View style={styles.chartShell}>
        <View style={styles.yAxis}>
          {['5k', '2k', '1k', '500', '100'].map((label) => (
            <Text key={label} style={styles.axisLabel}>
              {label}
            </Text>
          ))}
        </View>
        <View style={styles.chartPlot}>
          {[0, 1, 2, 3, 4].map((line) => (
            <View key={line} style={[styles.gridLine, { top: line * 38 }]} />
          ))}
          <View style={styles.chartColumns}>
            {project.values.map((value, index) => (
              <View key={`${project.name}-${timeLabels[index]}`} style={styles.chartColumn}>
                <View
                  accessibilityLabel={`${value.toLocaleString()} beneficiaries at ${timeLabels[index]}`}
                  accessible
                  style={[styles.chartBar, { height: Math.max(10, (value / maximum) * 145) }]}
                />
                <Text style={styles.timeLabel}>{timeLabels[index]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={[styles.legendDot, styles.organizationDot]} />
        <Text style={styles.legendText}>{project.name}</Text>
      </View>
    </View>
  );
}

function TopOrganizations() {
  return (
    <View>
      {topOrganizations.map((organization, index) => (
        <View key={organization.name} style={styles.organizationRow}>
          <Text style={styles.organizationRank}>{index + 1}</Text>
          <View style={styles.organizationIcon}>
            <Ionicons color={Palette.green} name="business-outline" size={18} />
          </View>
          <View style={styles.organizationIdentity}>
            <Text numberOfLines={1} style={styles.organizationName}>
              {organization.name}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons color={Palette.mutedLight} name="location-outline" size={11} />
              <Text style={styles.organizationLocation}>{organization.location}</Text>
            </View>
          </View>
          <View style={styles.organizationCount}>
            <Text style={styles.organizationCountValue}>{organization.projects}</Text>
            <Text style={styles.organizationCountLabel}>projects</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function ImpactMap({ selectedLocation }: { selectedLocation: LocationKey }) {
  const visibleMarkers = useMemo(() => {
    if (selectedLocation === 'north') return impactMarkers.filter((marker) => marker.latitude >= 9);
    if (selectedLocation === 'south') return impactMarkers.filter((marker) => marker.latitude < 9);
    return impactMarkers;
  }, [selectedLocation]);
  const location = locations[selectedLocation];
  const markerPins = visibleMarkers
    .map((marker) => {
      const color = marker.type === 'beneficiary' ? '167bd1' : '128a37';
      return `pin-s+${color}(${marker.longitude},${marker.latitude})`;
    })
    .join(',');
  const mapUrl =
    `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${markerPins}/` +
    `${location.longitude},${location.latitude},${location.zoom},0/700x460@2x?access_token=${MAPBOX_TOKEN}`;

  return (
    <View>
      <View style={styles.mapShell}>
        <Image
          accessibilityLabel={`Map showing project impact across ${location.label}`}
          contentFit="cover"
          source={{ uri: mapUrl }}
          style={styles.mapImage}
          transition={200}
        />
      </View>
      <View style={styles.mapLegend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, styles.beneficiaryDot]} />
          <Text style={styles.legendText}>Beneficiaries</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, styles.organizationDot]} />
          <Text style={styles.legendText}>Organizations</Text>
        </View>
      </View>
    </View>
  );
}

export default function ReportsScreen() {
  const [activeView, setActiveView] = useState<ReportView>('general');
  const [selectedProject, setSelectedProject] = useState(projectSeries[0].name);
  const [selectedLocation, setSelectedLocation] = useState<LocationKey>('all');
  const activeProject =
    projectSeries.find((project) => project.name === selectedProject) ?? projectSeries[0];

  return (
    <AppScreen>
      <PageHeader
        eyebrow="Impact intelligence"
        subtitle="Monitor delivery, reach, and the organizations creating measurable change."
        title="Reports"
      />

      <ReportTabs activeView={activeView} onChange={setActiveView} />

      <View style={styles.updatedCard}>
        <View style={styles.updatedIcon}>
          <Ionicons color={Palette.green} name="time-outline" size={18} />
        </View>
        <View style={styles.updatedText}>
          <Text style={styles.updatedTitle}>Last updated: May 16, 2025</Text>
          <Text style={styles.updatedSubtitle}>Data refreshes every 24 hours</Text>
        </View>
        <View style={styles.dateBadge}>
          <Ionicons color={Palette.green} name="calendar-outline" size={15} />
          <Text style={styles.dateText}>16 May</Text>
        </View>
      </View>

      <View accessibilityLabel="Report summary" style={styles.metricsGrid}>
        {reportMetrics[activeView].map((metric) => (
          <ReportMetricCard key={metric.title} metric={metric} />
        ))}
      </View>

      <View style={styles.panel}>
        <PanelHeader subtitle="Beneficiary reach throughout the day" title="Project Impact" />
        <ChoicePills
          active={selectedProject}
          onChange={setSelectedProject}
          options={projectSeries.map((project) => ({ label: project.name, value: project.name }))}
        />
        <ImpactChart project={activeProject} />
      </View>

      <View style={styles.panel}>
        <PanelHeader subtitle="Active organizations" title="Top Organizations" />
        <TopOrganizations />
      </View>

      <View style={styles.panel}>
        <PanelHeader subtitle="Where beneficiaries and partners are active" title="Geographic Impact" />
        <ChoicePills
          active={selectedLocation}
          onChange={setSelectedLocation}
          options={(Object.entries(locations) as [LocationKey, (typeof locations)[LocationKey]][]).map(
            ([value, location]) => ({ label: location.label, value }),
          )}
        />
        <ImpactMap selectedLocation={selectedLocation} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  axisLabel: { color: Palette.mutedLight, fontSize: 9, fontWeight: '600' },
  beneficiaryDot: { backgroundColor: '#167BD1' },
  chartBar: { backgroundColor: '#148A37', borderRadius: 3, minHeight: 10, width: 12 },
  chartColumn: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  chartColumns: {
    alignItems: 'flex-end',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    left: 0,
    paddingBottom: 22,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  chartPlot: { flex: 1, height: 180, position: 'relative' },
  chartShell: { flexDirection: 'row', gap: 8, marginTop: 20 },
  chartSummary: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: Palette.background,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 13,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chartSummaryDivider: { backgroundColor: Palette.border, height: 28, width: 1 },
  chartSummaryLabel: { color: Palette.muted, fontSize: 9, fontWeight: '700' },
  chartSummaryValue: { color: Palette.black, fontSize: 12, fontWeight: '900', marginTop: 2 },
  choice: {
    backgroundColor: Palette.background,
    borderColor: Palette.border,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  choiceActive: { backgroundColor: Palette.greenSoft, borderColor: '#B8E2CA' },
  choiceContent: { gap: 8, paddingVertical: 2 },
  choiceText: { color: Palette.muted, fontSize: 11, fontWeight: '700' },
  choiceTextActive: { color: Palette.green, fontWeight: '900' },
  dateBadge: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateText: { color: Palette.green, fontSize: 10, fontWeight: '900' },
  gridLine: { backgroundColor: Palette.border, height: StyleSheet.hairlineWidth, left: 0, position: 'absolute', right: 0 },
  legendDot: { borderRadius: 5, height: 9, width: 9 },
  legendRow: { alignItems: 'center', flexDirection: 'row', gap: 7, marginTop: 12 },
  legendText: { color: Palette.muted, fontSize: 10, fontWeight: '700' },
  locationRow: { alignItems: 'center', flexDirection: 'row', gap: 3, marginTop: 3 },
  mapImage: { backgroundColor: '#EEF3F2', height: 280, width: '100%' },
  mapLegend: { flexDirection: 'row', gap: 18, justifyContent: 'center' },
  mapShell: { borderRadius: 16, marginTop: 16, overflow: 'hidden' },
  metricCaption: { color: Palette.muted, fontSize: 10 },
  metricCard: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: 18,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    gap: 7,
    minHeight: 145,
    padding: 14,
    ...Shadow.card,
  },
  metricChange: {
    backgroundColor: Palette.greenSoft,
    borderRadius: 6,
    color: Palette.green,
    fontSize: 9,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  metricHeading: { alignItems: 'center', flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  metricPeriod: { color: Palette.mutedLight, flex: 1, fontSize: 8 },
  metricTitle: { color: Palette.muted, flex: 1, fontSize: 10, fontWeight: '700' },
  metricTrend: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  metricValue: { color: Palette.black, fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  organizationCount: { alignItems: 'flex-end' },
  organizationCountLabel: { color: Palette.mutedLight, fontSize: 9 },
  organizationCountValue: { color: Palette.green, fontSize: 14, fontWeight: '900' },
  organizationDot: { backgroundColor: '#128A37' },
  organizationIcon: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  organizationIdentity: { flex: 1 },
  organizationLocation: { color: Palette.mutedLight, fontSize: 10 },
  organizationName: { color: Palette.black, fontSize: 12, fontWeight: '800' },
  organizationRank: { color: Palette.mutedLight, fontSize: 10, textAlign: 'center', width: 17 },
  organizationRow: {
    alignItems: 'center',
    borderBottomColor: Palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 13,
  },
  panel: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 15,
    overflow: 'hidden',
    padding: 17,
    ...Shadow.card,
  },
  panelHeader: { gap: 3 },
  panelSubtitle: { color: Palette.muted, fontSize: 11 },
  panelTitle: { color: Palette.black, fontSize: 17, fontWeight: '900', letterSpacing: -0.2 },
  tab: { alignItems: 'center', borderRadius: Radius.pill, flex: 1, paddingVertical: 10 },
  tabActive: { backgroundColor: Palette.white, ...Shadow.card },
  tabText: { color: Palette.muted, fontSize: 12, fontWeight: '800' },
  tabTextActive: { color: Palette.green },
  tabs: { backgroundColor: Palette.greenSoft, borderRadius: Radius.pill, flexDirection: 'row', padding: 4 },
  timeLabel: { bottom: 0, color: Palette.mutedLight, fontSize: 8, position: 'absolute' },
  updatedCard: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 13,
  },
  updatedIcon: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 14,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  updatedSubtitle: { color: Palette.muted, fontSize: 9, marginTop: 2 },
  updatedText: { flex: 1 },
  updatedTitle: { color: Palette.black, fontSize: 11, fontWeight: '800' },
  yAxis: { height: 158, justifyContent: 'space-between', paddingBottom: 1, width: 24 },
});
