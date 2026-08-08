import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen, FormField, InlineNotice, PageHeader, PrimaryButton, SectionTitle } from '@/components/app-ui';
import { Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { apiPost } from '@/lib/api';

export default function SupportScreen() {
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; tone: 'danger' | 'success' } | null>(null);

  const submit = async () => {
    if (!name.trim() || message.trim().length < 10) {
      setNotice({ message: 'Add your name and a little more detail about how we can help.', tone: 'danger' });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      await apiPost('/send_support', {
        email: session?.user.email,
        message: message.trim(),
        name: name.trim(),
        phoneNumber,
      }, session?.token);
      setMessage('');
      setNotice({ message: 'Your message has been sent. The support team will follow up by email.', tone: 'success' });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Unable to contact support', tone: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <PageHeader eyebrow="We are here to help" subtitle="Questions about funding, projects, verification, or your account." title="Support" />
      <View style={styles.promise}>
        <Text style={styles.promiseTitle}>Human support, built in</Text>
        <Text style={styles.promiseText}>Share enough detail for the team to understand the situation. Replies go to {session?.user.email}.</Text>
      </View>
      {notice ? <InlineNotice message={notice.message} tone={notice.tone} /> : null}
      <View style={styles.form}>
        <SectionTitle title="Send a message" />
        <FormField icon="person-outline" label="Your name" onChangeText={setName} placeholder="Full name" value={name} />
        <FormField icon="call-outline" keyboardType="phone-pad" label="Phone number (optional)" onChangeText={setPhoneNumber} placeholder="+234..." value={phoneNumber} />
        <FormField icon="chatbubble-ellipses-outline" label="How can we help?" multiline onChangeText={setMessage} placeholder="Describe the issue or question..." value={message} />
        <PrimaryButton icon="paper-plane-outline" label="Send to support" loading={loading} onPress={() => void submit()} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  promise: {
    backgroundColor: Palette.greenDeep,
    borderRadius: Radius.card,
    gap: 7,
    padding: 20,
  },
  promiseTitle: { color: Palette.white, fontSize: 18, fontWeight: '900' },
  promiseText: { color: '#D8F4E8', fontSize: 13, lineHeight: 19 },
  form: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 14,
    padding: 17,
  },
});
