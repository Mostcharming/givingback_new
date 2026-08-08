import { router } from 'expo-router';
import { useState } from 'react';

import { AuthShell } from '@/components/auth-shell';
import { FormField, InlineNotice, PrimaryButton, TextButton } from '@/components/app-ui';
import { apiPost } from '@/lib/api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      await apiPost('/auth/forgotpassword', { email: email.trim().toLowerCase() });
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      subtitle="We’ll email you a secure reset link and token."
      title="Reset your password">
      {sent ? (
        <InlineNotice
          message="Check your inbox for your password reset instructions."
          tone="success"
        />
      ) : null}
      {error ? <InlineNotice message={error} tone="danger" /> : null}
      <FormField
        autoCapitalize="none"
        icon="mail-outline"
        keyboardType="email-address"
        label="Email address"
        onChangeText={setEmail}
        placeholder="you@example.com"
        value={email}
      />
      <PrimaryButton
        disabled={!email.trim()}
        icon="send-outline"
        label="Send reset link"
        loading={loading}
        onPress={submit}
      />
      <TextButton label="Back to sign in" onPress={() => router.replace('/login')} />
    </AuthShell>
  );
}
