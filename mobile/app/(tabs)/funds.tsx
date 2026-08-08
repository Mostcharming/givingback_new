import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  AppScreen,
  FormField,
  HeroCard,
  InlineNotice,
  PageHeader,
  PrimaryButton,
  SectionTitle,
  StatusPill,
} from '@/components/app-ui';
import { formatCurrency, formatDate, Palette, Radius, titleCase } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { apiPost } from '@/lib/api';
import { asRecord, extractCollection, getNumber, getString } from '@/lib/data';

type StripeSession = {
  sessionId: string;
  url: string;
};

export default function FundsScreen() {
  const { session } = useAuth();
  const role = session?.user.role || 'donor';
  const isNgo = role === 'NGO';
  const profile = useApiQuery<unknown>('/auth');
  const transactions = useApiQuery<unknown>('/admin/transactions', {
    query: { limit: 10 },
  });
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; tone: 'danger' | 'success' } | null>(
    null,
  );

  const profileRecord = asRecord(profile.data);
  const wallet = asRecord(profileRecord.wallet);
  const balance = getNumber(wallet.balance ?? wallet.balabce);
  const transactionItems = useMemo(
    () => extractCollection(transactions.data, ['donations', 'transactions']).slice(0, 10),
    [transactions.data],
  );

  const fundWallet = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount < 100) {
      setNotice({ message: 'Enter an amount of at least ₦100.', tone: 'danger' });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      const redirectUrl = Linking.createURL('/payment-result');
      const checkout = await apiPost<StripeSession>(
        '/stripe_session',
        {
          amount: numericAmount,
          cancel_url: `${redirectUrl}?status=cancelled`,
          currency: 'ngn',
          success_url: `${redirectUrl}?status=success&sessionId={CHECKOUT_SESSION_ID}`,
        },
        session?.token,
      );
      const result = await WebBrowser.openAuthSessionAsync(checkout.url, redirectUrl);
      if (result.type === 'success' && result.url) {
        const parsed = Linking.parse(result.url);
        const sessionId = String(parsed.queryParams?.sessionId || checkout.sessionId);
        await apiPost(
          '/verify-stripe-payment',
          {
            amount: numericAmount,
            sessionId,
            status: 'success',
            user_id: session?.user.id,
          },
          session?.token,
        );
        setNotice({ message: 'Wallet funded successfully.', tone: 'success' });
        setAmount('');
        void profile.refetch();
        void transactions.refetch();
      }
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : 'Unable to fund wallet',
        tone: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || !accountNumber || !bank) {
      setNotice({ message: 'Enter an amount, bank, and account number.', tone: 'danger' });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      await apiPost(
        '/ngo/withdraw_request',
        {
          accountNumber,
          amount: numericAmount,
          bank,
          saveAccount: true,
        },
        session?.token,
      );
      setNotice({ message: 'Withdrawal request submitted for review.', tone: 'success' });
      setAmount('');
      void transactions.refetch();
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : 'Unable to request withdrawal',
        tone: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => void Promise.all([profile.refetch(), transactions.refetch()]);

  return (
    <AppScreen onRefresh={refresh} refreshing={profile.loading || transactions.loading}>
      <PageHeader
        eyebrow={isNgo ? 'Project funds' : 'Giving wallet'}
        subtitle={
          isNgo
            ? 'Track incoming project funds and request secure withdrawals.'
            : 'Fund your wallet and follow every contribution and disbursement.'
        }
        title={isNgo ? 'Funds' : 'Wallet'}
      />

      <HeroCard
        eyebrow="Available balance"
        icon="wallet"
        subtitle="Your protected GivingBack wallet balance."
        title={formatCurrency(balance)}>
        <View style={styles.balanceMeta}>
          <Ionicons color="#BDEDD9" name="shield-checkmark" size={18} />
          <Text style={styles.balanceMetaText}>Transactions are recorded for transparency</Text>
        </View>
      </HeroCard>

      <View style={styles.formCard}>
        <SectionTitle
          subtitle={isNgo ? 'Requests are reviewed before payout.' : 'Secure hosted checkout.'}
          title={isNgo ? 'Request withdrawal' : 'Add funds'}
        />
        {notice ? <InlineNotice message={notice.message} tone={notice.tone} /> : null}
        <FormField
          icon="cash-outline"
          keyboardType="numeric"
          label="Amount (NGN)"
          onChangeText={setAmount}
          placeholder="0"
          value={amount}
        />
        {isNgo ? (
          <>
            <FormField
              icon="business-outline"
              label="Bank"
              onChangeText={setBank}
              placeholder="Bank name"
              value={bank}
            />
            <FormField
              icon="card-outline"
              keyboardType="number-pad"
              label="Account number"
              maxLength={10}
              onChangeText={setAccountNumber}
              placeholder="0000000000"
              value={accountNumber}
            />
          </>
        ) : null}
        <PrimaryButton
          icon={isNgo ? 'arrow-up-circle-outline' : 'add-circle-outline'}
          label={isNgo ? 'Submit withdrawal' : 'Continue to secure payment'}
          loading={loading}
          onPress={isNgo ? withdraw : fundWallet}
        />
      </View>

      <SectionTitle subtitle="Your latest wallet activity." title="Recent transactions" />
      <View style={styles.transactions}>
        {transactionItems.length === 0 ? (
          <Text style={styles.emptyText}>No transactions yet.</Text>
        ) : (
          transactionItems.map((item, index) => {
            const record = asRecord(item);
            const type = getString(record.type, 'Transaction');
            return (
              <View key={getString(record.id) || String(index)} style={styles.transaction}>
                <View style={styles.transactionIcon}>
                  <Ionicons
                    color={Palette.green}
                    name={type.toLowerCase().includes('withdraw') ? 'arrow-up' : 'arrow-down'}
                    size={18}
                  />
                </View>
                <View style={styles.transactionText}>
                  <Text style={styles.transactionTitle}>{titleCase(type)}</Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(getString(record.createdAt ?? record.created_at))}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={styles.transactionValue}>
                    {formatCurrency(record.amount)}
                  </Text>
                  <StatusPill status={getString(record.status, 'completed')} />
                </View>
              </View>
            );
          })
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  balanceMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  balanceMetaText: {
    color: '#D8F4E8',
    fontSize: 12,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 15,
    padding: 18,
  },
  transactions: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  transaction: {
    alignItems: 'center',
    borderBottomColor: Palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 11,
    padding: 14,
  },
  transactionIcon: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 13,
    height: 41,
    justifyContent: 'center',
    width: 41,
  },
  transactionText: {
    flex: 1,
    gap: 3,
  },
  transactionTitle: {
    color: Palette.black,
    fontSize: 13,
    fontWeight: '800',
  },
  transactionDate: {
    color: Palette.muted,
    fontSize: 11,
  },
  transactionAmount: {
    alignItems: 'flex-end',
    gap: 5,
  },
  transactionValue: {
    color: Palette.black,
    fontSize: 13,
    fontWeight: '900',
  },
  emptyText: {
    color: Palette.muted,
    padding: 24,
    textAlign: 'center',
  },
});
