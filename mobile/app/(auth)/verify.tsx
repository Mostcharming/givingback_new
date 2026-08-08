import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { AuthShell } from '@/components/auth-shell';
import { FormField, InlineNotice, PrimaryButton, TextButton } from '@/components/app-ui';
import { apiPost } from '@/lib/api';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verify = async () => {
    if (otp.length < 6) {
      setError('Enter the verification code from your email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiPost('/auth/verify', { otp });
      router.replace({
        pathname: '/login',
        params: { message: 'Email verified. Sign in to continue.' },
      });
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      subtitle={`Enter the code sent to ${email || 'your email address'}.`}
      title="Verify your email">
      {error ? <InlineNotice message={error} tone="danger" /> : null}
      <FormField
        icon="keypad-outline"
        keyboardType="number-pad"
        label="Verification code"
        maxLength={9}
        onChangeText={setOtp}
        placeholder="000000"
        value={otp}
      />
      <PrimaryButton
        icon="checkmark-circle-outline"
        label="Verify account"
        loading={loading}
        onPress={verify}
      />
      <TextButton label="Back to sign in" onPress={() => router.replace('/login')} />
    </AuthShell>
  );
}
