import { StyleSheet, Text, View } from 'react-native';

import { AppScreen, ErrorState, LoadingState, MetricCard, PageHeader, SectionTitle, StatusPill } from '@/components/app-ui';
import { formatCurrency, formatDate, Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { asRecord, extractCollection, getMetricValue, getNumber, getString } from '@/lib/data';

export default function ReportsScreen() {
  const { session } = useAuth();
  const role = session?.user.role || 'donor';
  const dashboard = useApiQuery<unknown>(role === 'admin' ? '/admin/dashboard' : '/donor/dashboard');
  const transactions = useApiQuery<unknown>('/admin/transactions', { query: { limit: 50 } });
  const data = asRecord(dashboard.data);
  const items = extractCollection(transactions.data, ['donations', 'transactions']);
  const total = items.reduce<number>((sum, item) => sum + getNumber(asRecord(item).amount), 0);
  const completed = items.filter((item) => {
    const status = getString(asRecord(item).status).toLowerCase();
    return status === 'completed' || status === 'success';
  }).length;
  const successRate = items.length ? Math.round((completed / items.length) * 100) : 0;
  const metrics = role === 'admin'
    ? [
        { icon: 'people-outline' as const, label: 'Platform users', value: getMetricValue(data, 'usersCount') },
        { icon: 'business-outline' as const, label: 'NGOs', value: getMetricValue(data, 'ngoUsersCount') },
      ]
    : role === 'NGO'
      ? [
          { icon: 'rocket-outline' as const, label: 'Active projects', value: getMetricValue(data, 'activeProjectsCount') },
          { icon: 'checkmark-done-outline' as const, label: 'Completed', value: getMetricValue(data, 'completedProjectsCount') },
        ]
      : [
          { icon: 'rocket-outline' as const, label: 'Active projects', value: getMetricValue(data, 'activeProjects') },
          { icon: 'people-outline' as const, label: 'Beneficiaries', value: getMetricValue(data, 'totalBeneficiaries') },
        ];

  const refresh = () => void Promise.all([dashboard.refetch(), transactions.refetch()]);

  return (
    <AppScreen onRefresh={refresh} refreshing={dashboard.loading || transactions.loading}>
      <PageHeader eyebrow="Impact intelligence" subtitle="A concise, live view of funding activity and delivery progress." title="Reports" />
      {dashboard.loading && transactions.loading ? (
        <LoadingState label="Building your report..." />
      ) : dashboard.error && transactions.error ? (
        <ErrorState message={dashboard.error} onRetry={refresh} />
      ) : (
        <>
          <View style={styles.metrics}>
            <MetricCard accent="green" icon="cash-outline" label="Tracked value" value={formatCurrency(total)} />
            <MetricCard accent="gold" icon="pulse-outline" label="Success rate" value={`${successRate}%`} />
            {metrics.map((metric, index) => (
              <MetricCard accent={index ? 'purple' : 'blue'} icon={metric.icon} key={metric.label} label={metric.label} value={String(metric.value ?? 0)} />
            ))}
          </View>

          <SectionTitle subtitle="Completion signal across recorded transactions." title="Funding health" />
          <View style={styles.healthCard}>
            <View style={styles.healthHeader}>
              <View>
                <Text style={styles.healthValue}>{successRate}%</Text>
                <Text style={styles.healthLabel}>completed successfully</Text>
              </View>
              <StatusPill status={successRate >= 70 ? 'healthy' : 'review'} />
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${successRate}%` }]} />
            </View>
            <View style={styles.legend}>
              <Text style={styles.legendText}>{completed} completed</Text>
              <Text style={styles.legendText}>{Math.max(items.length - completed, 0)} pending</Text>
            </View>
          </View>

          <SectionTitle subtitle="Most recent recorded funding activity." title="Activity ledger" />
          <View style={styles.ledger}>
            {items.slice(0, 12).map((item, index) => {
              const record = asRecord(item);
              return (
                <View key={getString(record.id) || String(index)} style={styles.row}>
                  <View style={styles.rowText}>
                    <Text numberOfLines={1} style={styles.rowTitle}>
                      {getString(record.project_name) || getString(record.type, 'Funding transaction')}
                    </Text>
                    <Text style={styles.rowDate}>{formatDate(getString(record.createdAt ?? record.created_at))}</Text>
                  </View>
                  <View style={styles.rowEnd}>
                    <Text style={styles.amount}>{formatCurrency(record.amount)}</Text>
                    <StatusPill status={getString(record.status, 'pending')} />
                  </View>
                </View>
              );
            })}
            {!items.length ? <Text style={styles.empty}>No report activity yet.</Text> : null}
          </View>
        </>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  healthCard: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 15,
    padding: 18,
  },
  healthHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  healthValue: { color: Palette.black, fontSize: 31, fontWeight: '900' },
  healthLabel: { color: Palette.muted, fontSize: 12 },
  track: { backgroundColor: Palette.greenSoft, borderRadius: 8, height: 10, overflow: 'hidden' },
  fill: { backgroundColor: Palette.greenBright, borderRadius: 8, height: '100%' },
  legend: { flexDirection: 'row', justifyContent: 'space-between' },
  legendText: { color: Palette.muted, fontSize: 11, fontWeight: '700' },
  ledger: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    borderBottomColor: Palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  rowText: { flex: 1, gap: 4 },
  rowTitle: { color: Palette.black, fontSize: 13, fontWeight: '800' },
  rowDate: { color: Palette.mutedLight, fontSize: 10 },
  rowEnd: { alignItems: 'flex-end', gap: 5 },
  amount: { color: Palette.black, fontSize: 13, fontWeight: '900' },
  empty: { color: Palette.muted, padding: 24, textAlign: 'center' },
});
