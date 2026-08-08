import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthShell } from '@/components/auth-shell';
import { FormField, InlineNotice, PrimaryButton } from '@/components/app-ui';
import { Palette } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';

export default function LoginScreen() {
  const { message } = useLocalSearchParams<{ message?: string }>();
  const {
    biometric,
    hasSavedSession,
    login,
    unlockWithBiometrics,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email address and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const unlock = async () => {
    setLoading(true);
    setError('');
    try {
      const unlocked = await unlockWithBiometrics();
      if (!unlocked) setError('Biometric unlock was cancelled.');
    } catch (unlockError) {
      setError(unlockError instanceof Error ? unlockError.message : 'Unable to unlock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      footer={
        <View style={styles.footer}>
          <Text style={styles.footerText}>New to GivingBack?</Text>
          <Link asChild href="/register">
            <Pressable>
              <Text style={styles.footerLink}>Create an account</Text>
            </Pressable>
          </Link>
        </View>
      }
      subtitle="Your impact workspace for projects, partners, funds, and measurable change."
      title={hasSavedSession ? 'Welcome back' : 'Good to see you'}>
      {message ? <InlineNotice message={message} tone="success" /> : null}
      {error ? <InlineNotice message={error} tone="danger" /> : null}

      {hasSavedSession && biometric.available ? (
        <>
          <PrimaryButton
            icon="finger-print"
            label={`Unlock with ${biometric.label}`}
            loading={loading}
            onPress={unlock}
          />
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or use password</Text>
            <View style={styles.dividerLine} />
          </View>
        </>
      ) : null}

      <FormField
        autoCapitalize="none"
        autoComplete="email"
        icon="mail-outline"
        keyboardType="email-address"
        label="Email address"
        onChangeText={setEmail}
        placeholder="you@example.com"
        value={email}
      />
      <View>
        <FormField
          autoCapitalize="none"
          autoComplete="current-password"
          icon="lock-closed-outline"
          label="Password"
          onChangeText={setPassword}
          onSubmitEditing={() => void handleLogin()}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          value={password}
        />
        <Pressable
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          onPress={() => setShowPassword((value) => !value)}
          style={styles.eyeButton}>
          <Ionicons
            color={Palette.muted}
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
          />
        </Pressable>
      </View>
      <Link asChild href="/forgot-password">
        <Pressable style={styles.forgot}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>
      </Link>
      <PrimaryButton
        disabled={!email.trim() || !password}
        icon="arrow-forward"
        label="Continue securely"
        loading={loading}
        onPress={handleLogin}
      />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  eyeButton: {
    bottom: 10,
    padding: 10,
    position: 'absolute',
    right: 5,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -6,
    paddingVertical: 4,
  },
  forgotText: {
    color: Palette.green,
    fontSize: 13,
    fontWeight: '800',
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  dividerLine: {
    backgroundColor: Palette.border,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: Palette.mutedLight,
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: Palette.muted,
    fontSize: 14,
  },
  footerLink: {
    color: Palette.green,
    fontSize: 14,
    fontWeight: '900',
  },
});
