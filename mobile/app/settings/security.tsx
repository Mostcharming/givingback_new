import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { AppScreen, FormField, InlineNotice, PageHeader, PrimaryButton, SectionTitle } from '@/components/app-ui';
import { Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { apiPost } from '@/lib/api';

export default function SecurityScreen() {
  const {
    biometric,
    biometricEnabled,
    disableBiometrics,
    enableBiometrics,
    session,
  } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; tone: 'danger' | 'success' } | null>(null);

  const toggleBiometrics = async (enabled: boolean) => {
    setNotice(null);
    try {
      if (enabled) await enableBiometrics();
      else await disableBiometrics();
      setNotice({ message: `${biometric.label} ${enabled ? 'enabled' : 'disabled'} successfully.`, tone: 'success' });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Unable to update biometrics', tone: 'danger' });
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 8) {
      setNotice({ message: 'Use at least 8 characters for your new password.', tone: 'danger' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setNotice({ message: 'New passwords do not match.', tone: 'danger' });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      await apiPost('/auth/changepassword', { newPassword, oldPassword }, session?.token);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNotice({ message: 'Your password has been updated.', tone: 'success' });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Unable to change password', tone: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <PageHeader eyebrow="Account protection" subtitle="Control secure access to your GivingBack account." title="Security" />
      {notice ? <InlineNotice message={notice.message} tone={notice.tone} /> : null}
      <View style={styles.biometricCard}>
        <View style={styles.biometricIcon}>
          <Ionicons color={Palette.green} name="finger-print" size={29} />
        </View>
        <View style={styles.biometricText}>
          <Text style={styles.biometricTitle}>Unlock with {biometric.label}</Text>
          <Text style={styles.biometricSubtitle}>
            {biometric.available
              ? 'Use your device biometrics to unlock your encrypted saved session.'
              : 'Set up biometrics in your device settings to enable this option.'}
          </Text>
        </View>
        <Switch
          disabled={!biometric.available}
          ios_backgroundColor={Palette.border}
          onValueChange={(value) => void toggleBiometrics(value)}
          thumbColor={Palette.white}
          trackColor={{ false: Palette.border, true: Palette.greenBright }}
          value={biometricEnabled}
        />
      </View>

      <View style={styles.infoCard}>
        <Ionicons color={Palette.blue} name="shield-checkmark-outline" size={22} />
        <Text style={styles.infoText}>Your biometric template stays on your device. GivingBack only receives the existing authenticated session after a successful unlock.</Text>
      </View>

      <View style={styles.form}>
        <SectionTitle subtitle="You will remain signed in on this device." title="Change password" />
        <FormField icon="lock-closed-outline" label="Current password" onChangeText={setOldPassword} secureTextEntry value={oldPassword} />
        <FormField icon="key-outline" label="New password" onChangeText={setNewPassword} secureTextEntry value={newPassword} />
        <FormField icon="checkmark-circle-outline" label="Confirm new password" onChangeText={setConfirmPassword} secureTextEntry value={confirmPassword} />
        <PrimaryButton icon="shield-checkmark-outline" label="Update password" loading={loading} onPress={() => void changePassword()} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  biometricCard: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  biometricIcon: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 19,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  biometricText: { flex: 1, gap: 4 },
  biometricTitle: { color: Palette.black, fontSize: 14, fontWeight: '900' },
  biometricSubtitle: { color: Palette.muted, fontSize: 11, lineHeight: 16 },
  infoCard: {
    alignItems: 'flex-start',
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.input,
    flexDirection: 'row',
    gap: 10,
    padding: 14,
  },
  infoText: { color: Palette.blue, flex: 1, fontSize: 12, fontWeight: '700', lineHeight: 18 },
  form: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 14,
    padding: 17,
  },
});
