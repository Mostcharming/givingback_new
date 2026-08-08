import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen, EmptyState, FormField, InlineNotice, LoadingState, PageHeader, PrimaryButton, SectionTitle } from '@/components/app-ui';
import { Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { apiDelete, apiPut } from '@/lib/api';
import { asRecord, extractCollection, getString } from '@/lib/data';

export default function BankAccountsScreen() {
  const { session } = useAuth();
  const profile = useApiQuery<unknown>('/auth');
  const accounts = extractCollection(profile.data, ['bank', 'banks']);
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bvn, setBvn] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; tone: 'danger' | 'success' } | null>(null);

  const addAccount = async () => {
    if (!bankName || !accountName || accountNumber.length !== 10) {
      setNotice({ message: 'Enter the bank, account name, and a 10-digit account number.', tone: 'danger' });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      await apiPut('/auth', { accountName, accountNumber, bankName, bvn }, session?.token);
      setBankName('');
      setAccountName('');
      setAccountNumber('');
      setBvn('');
      setNotice({ message: 'Bank account added securely.', tone: 'success' });
      void profile.refetch();
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Unable to add bank account', tone: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const removeAccount = (id: string) => {
    Alert.alert('Remove bank account?', 'This account will no longer be available for payouts.', [
      { style: 'cancel', text: 'Cancel' },
      {
        onPress: async () => {
          await apiDelete(`/auth/bank/${id}`, undefined, session?.token);
          void profile.refetch();
        },
        style: 'destructive',
        text: 'Remove',
      },
    ]);
  };

  return (
    <AppScreen onRefresh={() => void profile.refetch()} refreshing={profile.loading}>
      <PageHeader eyebrow="Payout details" subtitle="Manage verified destinations for project disbursements and withdrawals." title="Bank accounts" />
      {notice ? <InlineNotice message={notice.message} tone={notice.tone} /> : null}
      <SectionTitle title="Saved accounts" />
      {profile.loading ? <LoadingState label="Loading bank accounts..." /> : accounts.length === 0 ? (
        <EmptyState icon="card-outline" message="Add a bank account below to prepare for secure payouts." title="No saved account" />
      ) : (
        <View style={styles.list}>
          {accounts.map((item, index) => {
            const account = asRecord(item);
            const id = getString(account.id) || String(index);
            const number = getString(account.accountNumber);
            return (
              <View key={id} style={styles.account}>
                <View style={styles.bankIcon}><Ionicons color={Palette.green} name="business" size={21} /></View>
                <View style={styles.accountText}>
                  <Text style={styles.bank}>{getString(account.bankName, 'Bank account')}</Text>
                  <Text style={styles.number}>•••• ••{number.slice(-4)}</Text>
                  <Text style={styles.owner}>{getString(account.accountName)}</Text>
                </View>
                <Pressable accessibilityLabel="Remove account" onPress={() => removeAccount(id)} style={styles.remove}>
                  <Ionicons color={Palette.danger} name="trash-outline" size={19} />
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
      <View style={styles.form}>
        <SectionTitle subtitle="Details are encrypted in transit." title="Add an account" />
        <FormField icon="business-outline" label="Bank name" onChangeText={setBankName} placeholder="Bank" value={bankName} />
        <FormField icon="person-outline" label="Account name" onChangeText={setAccountName} placeholder="Name on account" value={accountName} />
        <FormField icon="card-outline" keyboardType="number-pad" label="Account number" maxLength={10} onChangeText={setAccountNumber} placeholder="0000000000" value={accountNumber} />
        <FormField icon="shield-checkmark-outline" keyboardType="number-pad" label="BVN (optional)" maxLength={11} onChangeText={setBvn} placeholder="Verification number" secureTextEntry value={bvn} />
        <PrimaryButton icon="add-circle-outline" label="Save bank account" loading={loading} onPress={() => void addAccount()} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  account: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 15,
  },
  bankIcon: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 16,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  accountText: { flex: 1, gap: 2 },
  bank: { color: Palette.black, fontSize: 14, fontWeight: '900' },
  number: { color: Palette.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  owner: { color: Palette.mutedLight, fontSize: 10 },
  remove: { alignItems: 'center', backgroundColor: Palette.dangerSoft, borderRadius: 13, height: 40, justifyContent: 'center', width: 40 },
  form: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 14,
    padding: 17,
  },
});
