import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/app-ui';
import { Palette } from '@/constants/design';

export default function PaymentResultScreen() {
  const { status } = useLocalSearchParams<{ status?: string }>();
  const successful = status === 'success';
  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.icon, { backgroundColor: successful ? Palette.greenSoft : Palette.goldSoft }]}>
        <Ionicons color={successful ? Palette.green : Palette.gold} name={successful ? 'checkmark-circle' : 'close-circle'} size={54} />
      </View>
      <Text style={styles.title}>{successful ? 'Wallet funded' : 'Payment not completed'}</Text>
      <Text style={styles.message}>
        {successful
          ? 'Your payment was verified and your GivingBack wallet is ready.'
          : 'No charge was completed. You can return to your wallet and try again.'}
      </Text>
      <View style={styles.button}>
        <PrimaryButton icon="wallet-outline" label="Return to wallet" onPress={() => router.replace('/(tabs)/funds')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'center', backgroundColor: Palette.background, flex: 1, justifyContent: 'center', padding: 28 },
  icon: { alignItems: 'center', borderRadius: 44, height: 88, justifyContent: 'center', marginBottom: 22, width: 88 },
  title: { color: Palette.black, fontSize: 28, fontWeight: '900', letterSpacing: -0.6, textAlign: 'center' },
  message: { color: Palette.muted, fontSize: 15, lineHeight: 22, marginTop: 10, maxWidth: 330, textAlign: 'center' },
  button: { marginTop: 30, width: '100%' },
});
