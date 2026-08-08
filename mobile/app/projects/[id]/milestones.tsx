import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  AppScreen,
  EmptyState,
  FormField,
  InlineNotice,
  LoadingState,
  PageHeader,
  PrimaryButton,
  SectionTitle,
  StatusPill,
} from '@/components/app-ui';
import { Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { apiPost } from '@/lib/api';
import { asArray, asRecord, getString } from '@/lib/data';

export default function MilestonesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const role = session?.user.role;
  const projectQuery = useApiQuery<unknown>('/allprojects', {
    query: { id, limit: 1, projectType: 'present' },
  });
  const project = asRecord(asArray(asRecord(projectQuery.data).projects)[0]);
  const milestones = asArray(project.milestones);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState<Record<string, unknown> | null>(null);
  const [achievement, setAchievement] = useState('');
  const [evidence, setEvidence] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; tone: 'danger' | 'success' } | null>(null);

  const createMilestone = async () => {
    if (!title || !description || !target) {
      setNotice({ message: 'Add a title, description, and target.', tone: 'danger' });
      return;
    }
    setLoading(true);
    try {
      await apiPost(
        '/auth/milestones',
        { description, due_date: dueDate, project_id: Number(id), target, title },
        session?.token,
      );
      setNotice({ message: 'Milestone created.', tone: 'success' });
      setTitle('');
      setDescription('');
      setTarget('');
      setDueDate('');
      void projectQuery.refetch();
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Unable to create milestone', tone: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const pickEvidence = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled) setEvidence(result.assets[0]);
  };

  const submitUpdate = async () => {
    if (!selectedMilestone || !achievement.trim()) {
      setNotice({ message: 'Choose a milestone and describe the progress made.', tone: 'danger' });
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('narration', description || achievement);
      form.append('achievement', achievement);
      form.append('position', '0');
      form.append('milestone_id', String(selectedMilestone.id));
      form.append('status', 'pending');
      if (evidence) {
        form.append('image', {
          name: evidence.fileName || 'milestone-evidence.jpg',
          type: evidence.mimeType || 'image/jpeg',
          uri: evidence.uri,
        } as unknown as Blob);
      }
      await apiPost('/ngo/milestone', form, session?.token);
      setNotice({ message: 'Milestone update sent to the donor.', tone: 'success' });
      setAchievement('');
      setEvidence(null);
      setSelectedMilestone(null);
      void projectQuery.refetch();
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Unable to submit update', tone: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen onRefresh={() => void projectQuery.refetch()} refreshing={projectQuery.loading}>
      <PageHeader
        eyebrow="Delivery plan"
        subtitle="Targets, evidence, verification, and payment progress."
        title={getString(project.title, 'Milestones')}
      />
      {projectQuery.loading ? (
        <LoadingState label="Loading milestones…" />
      ) : milestones.length === 0 ? (
        <EmptyState icon="flag-outline" message="Add the first delivery target for this project." title="No milestones yet" />
      ) : (
        <View style={styles.list}>
          {milestones.map((item, index) => {
            const milestone = asRecord(item);
            const selected = selectedMilestone?.id === milestone.id;
            return (
              <View key={getString(milestone.id) || String(index)} style={[styles.milestone, selected && styles.milestoneSelected]}>
                <View style={styles.milestoneHeader}>
                  <Text style={styles.number}>{index + 1}</Text>
                  <View style={styles.milestoneText}>
                    <Text style={styles.title}>{getString(milestone.milestone ?? milestone.title, `Milestone ${index + 1}`)}</Text>
                    <Text style={styles.description}>{getString(milestone.description, 'Delivery target')}</Text>
                  </View>
                  <StatusPill status={getString(milestone.status, 'pending')} />
                </View>
                {role === 'NGO' ? (
                  <PrimaryButton
                    label={selected ? 'Selected for update' : 'Submit an update'}
                    onPress={() => setSelectedMilestone(milestone)}
                    variant="secondary"
                  />
                ) : null}
              </View>
            );
          })}
        </View>
      )}

      {notice ? <InlineNotice message={notice.message} tone={notice.tone} /> : null}
      {role === 'NGO' && selectedMilestone ? (
        <View style={styles.form}>
          <SectionTitle subtitle="Add a measurable update and supporting evidence." title="Progress update" />
          <FormField label="Achievement / target covered" onChangeText={setAchievement} placeholder="e.g. 120 learners reached" value={achievement} />
          <FormField label="Narrative" multiline onChangeText={setDescription} placeholder="Describe what was completed…" value={description} />
          <PrimaryButton icon="image-outline" label={evidence ? 'Evidence selected' : 'Add photo evidence'} onPress={pickEvidence} variant="secondary" />
          <PrimaryButton icon="cloud-upload-outline" label="Send for verification" loading={loading} onPress={submitUpdate} />
        </View>
      ) : role === 'donor' || role === 'corporate' || role === 'admin' ? (
        <View style={styles.form}>
          <SectionTitle subtitle="Each milestone can gate a payment tranche." title="Add milestone" />
          <FormField label="Milestone title" onChangeText={setTitle} placeholder="Delivery target" value={title} />
          <FormField label="Description" multiline onChangeText={setDescription} placeholder="What evidence will show completion?" value={description} />
          <FormField label="Target" onChangeText={setTarget} placeholder="Measurable target" value={target} />
          <FormField label="Due date" onChangeText={setDueDate} placeholder="YYYY-MM-DD" value={dueDate} />
          <PrimaryButton icon="add-circle-outline" label="Create milestone" loading={loading} onPress={createMilestone} />
        </View>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  milestone: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 12,
    padding: 15,
  },
  milestoneSelected: { borderColor: Palette.green, borderWidth: 2 },
  milestoneHeader: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  number: {
    backgroundColor: Palette.greenDeep,
    borderRadius: 13,
    color: Palette.white,
    fontSize: 13,
    fontWeight: '900',
    height: 38,
    lineHeight: 38,
    textAlign: 'center',
    width: 38,
  },
  milestoneText: { flex: 1, gap: 3 },
  title: { color: Palette.black, fontSize: 14, fontWeight: '900' },
  description: { color: Palette.muted, fontSize: 12, lineHeight: 17 },
  form: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 14,
    padding: 17,
  },
});
