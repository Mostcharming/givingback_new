import { Ionicons } from '@expo/vector-icons';
import { type Href, router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, PageHeader, QuickAction, SectionTitle } from '@/components/app-ui';
import { Palette, Radius, Shadow, titleCase } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { asRecord, getString } from '@/lib/data';

export default function ProfileScreen() {
  const { biometricEnabled, logout, session } = useAuth();
  const profile = useApiQuery<unknown>('/auth');
  const profileRecord = asRecord(profile.data);
  const account = asRecord(profileRecord.user);
  const name = getString(account.name) || session?.user.email || 'GivingBack member';

  const confirmLogout = () => {
    Alert.alert('Sign out?', 'You’ll need your password or saved biometric session to return.', [
      { style: 'cancel', text: 'Cancel' },
      { onPress: () => void logout(), style: 'destructive', text: 'Sign out' },
    ]);
  };

  const go = (path: string) => router.push(path as Href);

  return (
    <AppScreen onRefresh={() => void profile.refetch()} refreshing={profile.loading}>
      <PageHeader
        eyebrow="Account & preferences"
        subtitle="Keep your profile, payout details, and security current."
        title="Your account"
      />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={styles.profileText}>
          <Text style={styles.name}>{titleCase(name)}</Text>
          <Text style={styles.email}>{session?.user.email}</Text>
          <View style={styles.rolePill}>
            <Ionicons color={Palette.green} name="shield-checkmark" size={14} />
            <Text style={styles.roleText}>{titleCase(session?.user.role)}</Text>
          </View>
        </View>
      </View>

      <SectionTitle title="Workspace" />
      <View style={styles.menu}>
        {(session?.user.role === 'donor' || session?.user.role === 'corporate') ? (
          <QuickAction icon="business-outline" label="NGO directory" onPress={() => go('/ngos')} />
        ) : null}
        <QuickAction icon="bar-chart-outline" label="Reports & insights" onPress={() => go('/reports')} />
        <QuickAction icon="notifications-outline" label="Notifications" onPress={() => go('/notifications')} />
      </View>

      <SectionTitle title="Account settings" />
      <View style={styles.menu}>
        {session?.user.role !== 'admin' ? (
          <>
            <QuickAction icon="person-outline" label="Edit profile" onPress={() => go('/settings/profile')} />
            <QuickAction icon="card-outline" label="Bank accounts" onPress={() => go('/settings/bank')} />
          </>
        ) : null}
        <QuickAction
          icon="finger-print"
          label={`Security${biometricEnabled ? ' · Biometrics on' : ''}`}
          onPress={() => go('/settings/security')}
        />
        <QuickAction icon="help-buoy-outline" label="Help & support" onPress={() => go('/settings/support')} />
      </View>

      <Pressable onPress={confirmLogout} style={styles.logout}>
        <Ionicons color={Palette.danger} name="log-out-outline" size={20} />
        <Text style={styles.logoutText}>Sign out</Text>
      </Pressable>
      <Text style={styles.version}>GivingBack Mobile · Version 1.0.0</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 15,
    padding: 18,
    ...Shadow.card,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: Palette.greenDeep,
    borderRadius: 27,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  avatarText: {
    color: Palette.white,
    fontSize: 23,
    fontWeight: '900',
  },
  profileText: {
    alignItems: 'flex-start',
    flex: 1,
    gap: 3,
  },
  name: {
    color: Palette.black,
    fontSize: 18,
    fontWeight: '900',
  },
  email: {
    color: Palette.muted,
    fontSize: 12,
  },
  rolePill: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 5,
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  roleText: {
    color: Palette.green,
    fontSize: 10,
    fontWeight: '900',
  },
  menu: {
    gap: 9,
  },
  logout: {
    alignItems: 'center',
    backgroundColor: Palette.dangerSoft,
    borderRadius: Radius.button,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    minHeight: 54,
  },
  logoutText: {
    color: Palette.danger,
    fontSize: 14,
    fontWeight: '900',
  },
  version: {
    color: Palette.mutedLight,
    fontSize: 11,
    textAlign: 'center',
  },
});
