import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthShell } from '@/components/auth-shell';
import { FormField, InlineNotice, PrimaryButton } from '@/components/app-ui';
import { Palette } from '@/constants/design';
import { apiPost } from '@/lib/api';

type AccountType = 'corporate' | 'donor' | 'organization';

export default function RegisterScreen() {
  const [accountType, setAccountType] = useState<AccountType>('organization');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [interestArea, setInterestArea] = useState('');
  const [cac, setCac] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Complete all required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      const selectedOption = accountType === 'organization' ? 'organization' : 'donor';
      const values: Record<string, string> = {
        cac,
        cpassword: confirmPassword,
        country: 'Nigeria',
        email: email.trim().toLowerCase(),
        interest_area: interestArea,
        name,
        password,
        phone,
        selectedOption,
        state,
        userType: accountType === 'corporate' ? 'corporate' : 'individual',
      };
      Object.entries(values).forEach(([key, value]) => form.append(key, value));
      await apiPost('/auth/new/onboard', form);
      router.replace({
        pathname: '/verify',
        params: { email: email.trim().toLowerCase() },
      });
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      footer={
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already registered?</Text>
          <Link asChild href="/login">
            <Pressable>
              <Text style={styles.footerLink}>Sign in</Text>
            </Pressable>
          </Link>
        </View>
      }
      subtitle="Choose your workspace and start managing measurable impact."
      title="Create your account">
      <Text style={styles.label}>I’m joining as</Text>
      <View style={styles.roleGrid}>
        {(
          [
            ['organization', 'NGO'],
            ['donor', 'Donor'],
            ['corporate', 'Corporate'],
          ] as const
        ).map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => setAccountType(value)}
            style={[
              styles.roleButton,
              accountType === value && styles.roleButtonActive,
            ]}>
            <Text
              style={[
                styles.roleButtonText,
                accountType === value && styles.roleButtonTextActive,
              ]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      {error ? <InlineNotice message={error} tone="danger" /> : null}
      <FormField
        icon="person-outline"
        label={accountType === 'organization' ? 'Organization name' : 'Full name'}
        onChangeText={setName}
        placeholder="Enter your name"
        value={name}
      />
      <FormField
        autoCapitalize="none"
        icon="mail-outline"
        keyboardType="email-address"
        label="Email address"
        onChangeText={setEmail}
        placeholder="you@example.com"
        value={email}
      />
      <FormField
        icon="call-outline"
        keyboardType="phone-pad"
        label="Phone number"
        onChangeText={setPhone}
        placeholder="+234"
        value={phone}
      />
      <FormField
        icon="location-outline"
        label="State"
        onChangeText={setState}
        placeholder="e.g. Lagos"
        value={state}
      />
      <FormField
        icon="leaf-outline"
        label="Impact area"
        onChangeText={setInterestArea}
        placeholder="e.g. Education, Health"
        value={interestArea}
      />
      {accountType === 'organization' ? (
        <FormField
          icon="business-outline"
          label="CAC number"
          onChangeText={setCac}
          placeholder="Registration number"
          value={cac}
        />
      ) : null}
      <FormField
        autoCapitalize="none"
        icon="lock-closed-outline"
        label="Password"
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        secureTextEntry
        value={password}
      />
      <FormField
        autoCapitalize="none"
        icon="shield-checkmark-outline"
        label="Confirm password"
        onChangeText={setConfirmPassword}
        placeholder="Repeat your password"
        secureTextEntry
        value={confirmPassword}
      />
      <PrimaryButton
        icon="person-add-outline"
        label="Create account"
        loading={loading}
        onPress={submit}
      />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Palette.black,
    fontSize: 13,
    fontWeight: '800',
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    alignItems: 'center',
    backgroundColor: Palette.background,
    borderColor: Palette.border,
    borderRadius: 13,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 11,
  },
  roleButtonActive: {
    backgroundColor: Palette.greenSoft,
    borderColor: Palette.green,
  },
  roleButtonText: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  roleButtonTextActive: {
    color: Palette.green,
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
