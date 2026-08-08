import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  AppScreen,
  EmptyState,
  ErrorState,
  FormField,
  HeroCard,
  InlineNotice,
  LoadingState,
  MetricCard,
  PrimaryButton,
  SectionTitle,
  StatusPill,
} from '@/components/app-ui';
import { formatCurrency, formatDate, Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { apiPost } from '@/lib/api';
import { asArray, asRecord, extractProjects, getString } from '@/lib/data';

export default function BriefDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const briefQuery = useApiQuery<unknown>('/allprojects', {
    query: { id, limit: 1, status: 'brief' },
  });
  const statusQuery = useApiQuery<{ hasApplied?: boolean }>(
    `/auth/projects/${id}/application-status`,
  );
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [document, setDocument] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; tone: 'danger' | 'success' } | null>(
    null,
  );
  const brief = extractProjects(briefQuery.data)[0];
  const raw = asRecord(asArray(asRecord(briefQuery.data).projects)[0]);
  const milestones = asArray(raw.milestones);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    });
    if (!result.canceled) setDocument(result.assets[0]);
  };

  const apply = async () => {
    if (!coverLetter.trim()) {
      setNotice({ message: 'Add a cover letter explaining your approach.', tone: 'danger' });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      const form = new FormData();
      form.append('projectId', String(id));
      form.append('coverLetter', coverLetter.trim());
      form.append(
        'deliverables',
        JSON.stringify(deliverables.split('\n').map((value) => value.trim()).filter(Boolean)),
      );
      if (document) {
        form.append('supportingDocument', {
          name: document.name,
          type: document.mimeType || 'application/octet-stream',
          uri: document.uri,
        } as unknown as Blob);
      }
      await apiPost(`/auth/projects/${id}/apply`, form, session?.token);
      setNotice({ message: 'Proposal submitted successfully.', tone: 'success' });
      setShowForm(false);
      void statusQuery.refetch();
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : 'Unable to submit proposal',
        tone: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  if (briefQuery.loading) return <AppScreen><LoadingState /></AppScreen>;
  if (briefQuery.error) {
    return <AppScreen><ErrorState message={briefQuery.error} onRetry={() => void briefQuery.refetch()} /></AppScreen>;
  }
  if (!brief) {
    return <AppScreen><EmptyState icon="document-outline" message="This brief is not currently available." title="Brief not found" /></AppScreen>;
  }

  return (
    <AppScreen>
      <HeroCard
        eyebrow="Open funding opportunity"
        icon="document-text"
        subtitle={brief.description}
        title={brief.title || 'Funding brief'}>
        <View style={styles.heroStatus}>
          <StatusPill status={statusQuery.data?.hasApplied ? 'applied' : brief.status} />
        </View>
      </HeroCard>
      <View style={styles.metrics}>
        <MetricCard accent="green" icon="cash-outline" label="Budget" value={formatCurrency(brief.cost)} />
        <MetricCard accent="gold" icon="calendar-outline" label="Deadline" value={formatDate(brief.endDate)} />
      </View>

      <SectionTitle subtitle="What the donor expects to be delivered." title="Milestone plan" />
      <View style={styles.card}>
        {milestones.length === 0 ? (
          <Text style={styles.body}>Milestones will be agreed with the selected implementation partner.</Text>
        ) : (
          milestones.map((item, index) => {
            const milestone = asRecord(item);
            return (
              <View key={getString(milestone.id) || String(index)} style={styles.milestone}>
                <Text style={styles.milestoneNumber}>{index + 1}</Text>
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneTitle}>{getString(milestone.milestone ?? milestone.title, `Milestone ${index + 1}`)}</Text>
                  <Text style={styles.body}>{getString(milestone.description)}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {notice ? <InlineNotice message={notice.message} tone={notice.tone} /> : null}
      {statusQuery.data?.hasApplied ? (
        <InlineNotice message="Your proposal is already with the donor for review." tone="success" />
      ) : showForm ? (
        <View style={styles.form}>
          <SectionTitle subtitle="Show the donor why your team is the right partner." title="Your proposal" />
          <FormField
            label="Cover letter"
            multiline
            onChangeText={setCoverLetter}
            placeholder="Explain your approach, capacity, and relevant experience…"
            value={coverLetter}
          />
          <FormField
            label="Key deliverables"
            multiline
            onChangeText={setDeliverables}
            placeholder="One deliverable per line"
            value={deliverables}
          />
          <PrimaryButton
            icon="attach-outline"
            label={document ? document.name : 'Attach supporting document'}
            onPress={pickDocument}
            variant="secondary"
          />
          <PrimaryButton icon="send-outline" label="Submit proposal" loading={loading} onPress={apply} />
          <PrimaryButton label="Cancel" onPress={() => setShowForm(false)} variant="secondary" />
        </View>
      ) : (
        <PrimaryButton icon="paper-plane-outline" label="Apply for this brief" onPress={() => setShowForm(true)} />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroStatus: { marginTop: 10 },
  metrics: { flexDirection: 'row', gap: 10 },
  card: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 12,
    padding: 17,
  },
  milestone: { flexDirection: 'row', gap: 11 },
  milestoneNumber: {
    backgroundColor: Palette.greenSoft,
    borderRadius: 12,
    color: Palette.green,
    fontSize: 13,
    fontWeight: '900',
    height: 34,
    lineHeight: 34,
    textAlign: 'center',
    width: 34,
  },
  milestoneContent: { flex: 1, gap: 3 },
  milestoneTitle: { color: Palette.black, fontSize: 14, fontWeight: '900' },
  body: { color: Palette.muted, fontSize: 13, lineHeight: 19 },
  form: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 15,
    padding: 17,
  },
});
