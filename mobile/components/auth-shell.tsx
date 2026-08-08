import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette, Shadow } from '@/constants/design';

export function AuthShell({
  children,
  footer,
  subtitle,
  title,
}: PropsWithChildren<{
  footer?: ReactNode;
  subtitle: string;
  title: string;
}>) {
  return (
    <LinearGradient colors={['#E6F7EE', '#F7FAF7', '#F9F3E8']} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.brandRow}>
              <LinearGradient colors={[Palette.greenBright, Palette.green]} style={styles.brandMark}>
                <Ionicons color={Palette.white} name="heart" size={23} />
              </LinearGradient>
              <Text style={styles.brandName}>GivingBack</Text>
            </View>

            <View style={styles.heading}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            <View style={styles.card}>{children}</View>
            {footer}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <View style={styles.orbOne} />
      <View style={styles.orbTwo} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  brandRow: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 34,
  },
  brandMark: {
    alignItems: 'center',
    borderRadius: 15,
    height: 46,
    justifyContent: 'center',
    width: 46,
    ...Shadow.card,
  },
  brandName: {
    color: Palette.greenDeep,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heading: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  title: {
    color: Palette.black,
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subtitle: {
    color: Palette.muted,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 330,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderColor: 'rgba(255,255,255,0.96)',
    borderRadius: 28,
    borderWidth: 1,
    gap: 17,
    padding: 20,
    ...Shadow.floating,
  },
  orbOne: {
    backgroundColor: 'rgba(18,163,109,0.08)',
    borderRadius: 100,
    height: 190,
    left: -85,
    position: 'absolute',
    top: -50,
    width: 190,
    zIndex: -1,
  },
  orbTwo: {
    backgroundColor: 'rgba(201,138,38,0.08)',
    borderRadius: 100,
    bottom: -70,
    height: 200,
    position: 'absolute',
    right: -80,
    width: 200,
    zIndex: -1,
  },
});
