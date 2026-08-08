import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppScreen,
  FormField,
  InlineNotice,
  PageHeader,
  PrimaryButton,
} from '@/components/app-ui';
import { Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { apiPost } from '@/lib/api';

export default function CreateProjectScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { session } = useAuth();
  const role = session?.user.role;
  const isPast = mode === 'past';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; tone: 'danger' | 'success' } | null>(null);

  const submit = async (publish = false) => {
    if (!title || !description || !category || !budget || !deadline || !state || !lga) {
      setNotice({ message: 'Complete every project field.', tone: 'danger' });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      if ((role === 'donor' || role === 'corporate') && !isPast) {
        await apiPost(
          '/auth/donor/projects',
          {
            budget: Number(budget),
            category,
            deadline,
            description,
            ispublic: true,
            lga,
            selectedAreas: [],
            state,
            status: publish ? 'brief' : 'draft',
            title,
            visibilityType: 'public',
          },
          session?.token,
        );
      } else {
        const form = new FormData();
        const values: Record<string, string> = {
          cost: budget,
          description,
          duration: '',
          endDate: deadline,
          interest_area: category,
          raised: '0',
          startDate: new Date().toISOString().slice(0, 10),
          state,
          status: isPast ? 'completed' : publish ? 'active' : 'draft',
          title,
        };
        Object.entries(values).forEach(([key, value]) => form.append(key, value));
        await apiPost(isPast ? '/ngo/previous-project' : '/ngo/project_v2', form, session?.token);
      }
      setNotice({ message: isPast ? 'Past project added.' : 'Project saved successfully.', tone: 'success' });
      setTimeout(() => router.back(), 700);
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Unable to save project', tone: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <PageHeader
        eyebrow={isPast ? 'Portfolio history' : 'New impact work'}
        subtitle={isPast ? 'Add a completed project to strengthen your profile.' : 'Capture the scope, funding, place, and delivery deadline.'}
        title={isPast ? 'Add past project' : 'Create project'}
      />
      <View style={styles.form}>
        {notice ? <InlineNotice message={notice.message} tone={notice.tone} /> : null}
        <FormField icon="create-outline" label="Project title" onChangeText={setTitle} placeholder="A clear, outcome-focused title" value={title} />
        <FormField label="Description and scope" multiline onChangeText={setDescription} placeholder="What will change, for whom, and how?" value={description} />
        <FormField icon="leaf-outline" label="Impact area" onChangeText={setCategory} placeholder="Education, health, climate…" value={category} />
        <FormField icon="cash-outline" keyboardType="numeric" label="Budget (NGN)" onChangeText={setBudget} placeholder="0" value={budget} />
        <FormField icon="calendar-outline" label="Deadline" onChangeText={setDeadline} placeholder="YYYY-MM-DD" value={deadline} />
        <FormField icon="map-outline" label="State" onChangeText={setState} placeholder="State" value={state} />
        <FormField icon="location-outline" label="LGA / city" onChangeText={setLga} placeholder="Local area" value={lga} />
        {!isPast ? (
          <PrimaryButton icon="archive-outline" label="Save as draft" loading={loading} onPress={() => void submit(false)} variant="secondary" />
        ) : null}
        <PrimaryButton icon={isPast ? 'checkmark' : 'paper-plane-outline'} label={isPast ? 'Add to portfolio' : 'Save & publish brief'} loading={loading} onPress={() => void submit(true)} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 15,
    padding: 17,
  },
});
