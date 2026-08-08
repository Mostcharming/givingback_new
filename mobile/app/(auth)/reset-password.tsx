import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { AuthShell } from '@/components/auth-shell';
import { FormField, InlineNotice, PrimaryButton } from '@/components/app-ui';
import { apiPost } from '@/lib/api';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string }>();
  const [token, setToken] = useState(params.token || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!token || password.length < 8 || password !== confirm) {
      setError('Enter your token and matching passwords of at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiPost('/auth/resetpassword', { newPassword: password, token });
      router.replace({
        pathname: '/login',
        params: { message: 'Password updated. You can now sign in.' },
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell subtitle="Choose a strong new password for your account." title="New password">
      {error ? <InlineNotice message={error} tone="danger" /> : null}
      <FormField
        icon="key-outline"
        keyboardType="number-pad"
        label="Reset token"
        onChangeText={setToken}
        placeholder="Token from your email"
        value={token}
      />
      <FormField
        icon="lock-closed-outline"
        label="New password"
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        secureTextEntry
        value={password}
      />
      <FormField
        icon="shield-checkmark-outline"
        label="Confirm password"
        onChangeText={setConfirm}
        placeholder="Repeat your password"
        secureTextEntry
        value={confirm}
      />
      <PrimaryButton
        icon="checkmark"
        label="Update password"
        loading={loading}
        onPress={submit}
      />
    </AuthShell>
  );
}
