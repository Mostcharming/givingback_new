import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  AppScreen,
  EmptyState,
  ErrorState,
  InlineNotice,
  LoadingState,
  PageHeader,
  PrimaryButton,
  StatusPill,
} from '@/components/app-ui';
import { Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { apiPut } from '@/lib/api';
import { asRecord, extractCollection, getString } from '@/lib/data';

export default function ApplicationsScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { session } = useAuth();
  const applications = useApiQuery<unknown>(`/auth/donor/projects/${projectId}/applications`);
  const [loadingId, setLoadingId] = useState('');
  const [notice, setNotice] = useState<{ message: string; tone: 'danger' | 'success' } | null>(null);
  const items = extractCollection(applications.data, ['applications', 'data']);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setLoadingId(id);
    setNotice(null);
    try {
      await apiPut(
        `/auth/donor/projects/${projectId}/applications/${id}/status`,
        { status },
        session?.token,
      );
      setNotice({ message: `Application ${status}.`, tone: 'success' });
      void applications.refetch();
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Unable to update application', tone: 'danger' });
    } finally {
      setLoadingId('');
    }
  };

  return (
    <AppScreen onRefresh={() => void applications.refetch()} refreshing={applications.loading}>
      <PageHeader
        eyebrow="Partner selection"
        subtitle="Review capability, proposal quality, and relevant project experience."
        title="Applications"
      />
      {notice ? <InlineNotice message={notice.message} tone={notice.tone} /> : null}
      {applications.loading ? (
        <LoadingState label="Loading applications…" />
      ) : applications.error ? (
        <ErrorState message={applications.error} onRetry={() => void applications.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState icon="people-outline" message="NGO proposals will appear here as they are submitted." title="No applications yet" />
      ) : (
        <View style={styles.list}>
          {items.map((item, index) => {
            const application = asRecord(item);
            const organization = asRecord(application.organization);
            const id = getString(application.id) || String(index);
            const status = getString(application.status, 'pending');
            return (
              <View key={id} style={styles.card}>
                <View style={styles.header}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {getString(application.ngo_name ?? organization.name, 'N').slice(0, 1).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.headerText}>
                    <Text style={styles.name}>{getString(application.ngo_name ?? organization.name, 'NGO applicant')}</Text>
                    <Text style={styles.meta}>{getString(application.interest_area ?? organization.interest_area, 'Impact organization')}</Text>
                  </View>
                  <StatusPill status={status} />
                </View>
                <Text style={styles.cover}>{getString(application.cover_letter ?? application.coverLetter, 'No cover letter supplied.')}</Text>
                {status === 'pending' ? (
                  <View style={styles.actions}>
                    <View style={styles.action}>
                      <PrimaryButton label="Reject" loading={loadingId === id} onPress={() => void updateStatus(id, 'rejected')} variant="secondary" />
                    </View>
                    <View style={styles.action}>
                      <PrimaryButton icon="checkmark" label="Approve" loading={loadingId === id} onPress={() => void updateStatus(id, 'approved')} />
                    </View>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 13,
    padding: 16,
  },
  header: { alignItems: 'center', flexDirection: 'row', gap: 11 },
  avatar: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 21,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  avatarText: { color: Palette.green, fontSize: 17, fontWeight: '900' },
  headerText: { flex: 1, gap: 3 },
  name: { color: Palette.black, fontSize: 14, fontWeight: '900' },
  meta: { color: Palette.muted, fontSize: 11 },
  cover: { color: Palette.muted, fontSize: 13, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 9 },
  action: { flex: 1 },
});
