import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette, Radius, Shadow, titleCase } from '@/constants/design';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function AppScreen({
  children,
  contentStyle,
  onRefresh,
  refreshing = false,
  scroll = true,
}: PropsWithChildren<{
  contentStyle?: ViewStyle;
  onRefresh?: () => void;
  refreshing?: boolean;
  scroll?: boolean;
}>) {
  const content = (
    <SafeAreaView edges={['top']} style={[styles.screenContent, contentStyle]}>
      {children}
    </SafeAreaView>
  );

  if (!scroll) return <View style={styles.screen}>{content}</View>;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            colors={[Palette.green]}
            onRefresh={onRefresh}
            refreshing={refreshing}
            tintColor={Palette.green}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      style={styles.screen}>
      {content}
    </ScrollView>
  );
}

export function PageHeader({
  action,
  eyebrow,
  subtitle,
  title,
}: {
  action?: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderText}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.pageTitle}>{title}</Text>
        {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function HeroCard({
  children,
  eyebrow,
  icon = 'sparkles',
  subtitle,
  title,
}: PropsWithChildren<{
  eyebrow?: string;
  icon?: IconName;
  subtitle?: string;
  title: string;
}>) {
  return (
    <LinearGradient
      colors={[Palette.greenDeep, '#0D6449', '#12A36D']}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.hero}>
      <View style={styles.heroOrbOne} />
      <View style={styles.heroOrbTwo} />
      <View style={styles.heroIcon}>
        <Ionicons color={Palette.white} name={icon} size={22} />
      </View>
      {eyebrow ? <Text style={styles.heroEyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.heroTitle}>{title}</Text>
      {subtitle ? <Text style={styles.heroSubtitle}>{subtitle}</Text> : null}
      {children}
    </LinearGradient>
  );
}

export function SectionTitle({
  action,
  subtitle,
  title,
}: {
  action?: ReactNode;
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionHeadingText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function MetricCard({
  accent = 'green',
  icon,
  label,
  value,
}: {
  accent?: 'blue' | 'gold' | 'green' | 'purple';
  icon: IconName;
  label: string;
  value: ReactNode;
}) {
  const colors = {
    blue: [Palette.blueSoft, Palette.blue],
    gold: [Palette.goldSoft, Palette.gold],
    green: [Palette.greenSoft, Palette.green],
    purple: [Palette.purpleSoft, Palette.purple],
  } as const;
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: colors[accent][0] }]}>
        <Ionicons color={colors[accent][1]} name={icon} size={20} />
      </View>
      <Text numberOfLines={1} style={styles.metricValue}>
        {value}
      </Text>
      <Text numberOfLines={2} style={styles.metricLabel}>
        {label}
      </Text>
    </View>
  );
}

export function QuickAction({
  color = Palette.green,
  icon,
  label,
  onPress,
}: {
  color?: string;
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}>
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons color={color} name={icon} size={21} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
      <Ionicons color={Palette.mutedLight} name="chevron-forward" size={16} />
    </Pressable>
  );
}

export function StatusPill({ status }: { status?: string | null }) {
  const normalized = String(status || 'unknown').toLowerCase();
  const isPositive = ['active', 'approved', 'completed', 'success', 'verified'].includes(normalized);
  const isWarning = ['brief', 'draft', 'pending', 'review', 'submitted'].includes(normalized);
  const backgroundColor = isPositive
    ? Palette.greenSoft
    : isWarning
      ? Palette.goldSoft
      : Palette.blueSoft;
  const color = isPositive ? Palette.green : isWarning ? Palette.gold : Palette.blue;
  return (
    <View style={[styles.statusPill, { backgroundColor }]}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={[styles.statusText, { color }]}>{titleCase(status || 'New')}</Text>
    </View>
  );
}

export type ProjectLike = {
  category?: string;
  cost?: number | string;
  description?: string;
  endDate?: string;
  end_date?: string;
  id: number | string;
  image?: string;
  state?: string;
  status?: string;
  title?: string;
};

export function ProjectCard({
  item,
  onPress,
}: {
  item: ProjectLike;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.projectCard, pressed && styles.pressed]}>
      <View style={styles.projectTopRow}>
        <View style={styles.projectIcon}>
          <Ionicons color={Palette.green} name="leaf-outline" size={23} />
        </View>
        <StatusPill status={item.status} />
      </View>
      <Text numberOfLines={2} style={styles.projectTitle}>
        {item.title || 'Untitled project'}
      </Text>
      <Text numberOfLines={2} style={styles.projectDescription}>
        {item.description || 'Open this project to see its scope, milestones, and funding details.'}
      </Text>
      <View style={styles.projectMetaRow}>
        <View style={styles.projectMeta}>
          <Ionicons color={Palette.muted} name="pricetag-outline" size={15} />
          <Text numberOfLines={1} style={styles.projectMetaText}>
            {item.category || 'Impact'}
          </Text>
        </View>
        <View style={styles.projectMeta}>
          <Ionicons color={Palette.muted} name="location-outline" size={15} />
          <Text numberOfLines={1} style={styles.projectMetaText}>
            {item.state || 'Nigeria'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function FormField({
  icon,
  label,
  multiline,
  ...props
}: TextInputProps & {
  icon?: IconName;
  keyboardType?: KeyboardTypeOptions;
  label: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputShell, multiline && styles.inputShellMultiline]}>
        {icon ? <Ionicons color={Palette.muted} name={icon} size={19} /> : null}
        <TextInput
          multiline={multiline}
          placeholderTextColor={Palette.mutedLight}
          style={[styles.input, multiline && styles.inputMultiline]}
          {...props}
        />
      </View>
    </View>
  );
}

export function PrimaryButton({
  disabled,
  icon,
  label,
  loading,
  onPress,
  variant = 'primary',
}: {
  disabled?: boolean;
  icon?: IconName;
  label: string;
  loading?: boolean;
  onPress: () => void;
  variant?: 'danger' | 'primary' | 'secondary';
}) {
  const backgroundColor =
    variant === 'secondary'
      ? Palette.greenSoft
      : variant === 'danger'
        ? Palette.danger
        : Palette.green;
  const color = variant === 'secondary' ? Palette.green : Palette.white;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        { backgroundColor },
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}>
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          {icon ? <Ionicons color={color} name={icon} size={19} /> : null}
          <Text style={[styles.primaryButtonText, { color }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function TextButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.textButton}>
      <Text style={styles.textButtonLabel}>{label}</Text>
    </Pressable>
  );
}

export function LoadingState({ label = 'Loading your workspace…' }: { label?: string }) {
  return (
    <View style={styles.stateCard}>
      <ActivityIndicator color={Palette.green} size="large" />
      <Text style={styles.stateTitle}>{label}</Text>
    </View>
  );
}

export function EmptyState({
  action,
  icon = 'sparkles-outline',
  message,
  title,
}: {
  action?: ReactNode;
  icon?: IconName;
  message: string;
  title: string;
}) {
  return (
    <View style={styles.stateCard}>
      <View style={styles.emptyIcon}>
        <Ionicons color={Palette.green} name={icon} size={28} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {action}
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      action={
        onRetry ? <PrimaryButton icon="refresh" label="Try again" onPress={onRetry} /> : undefined
      }
      icon="cloud-offline-outline"
      message={message}
      title="We couldn’t load this"
    />
  );
}

export function InlineNotice({
  message,
  tone = 'info',
}: {
  message: string;
  tone?: 'danger' | 'info' | 'success';
}) {
  const config: Record<
    'danger' | 'info' | 'success',
    { background: string; color: string; icon: IconName }
  > = {
    danger: {
      background: Palette.dangerSoft,
      color: Palette.danger,
      icon: 'alert-circle-outline',
    },
    info: {
      background: Palette.blueSoft,
      color: Palette.blue,
      icon: 'information-circle-outline',
    },
    success: {
      background: Palette.greenSoft,
      color: Palette.green,
      icon: 'checkmark-circle-outline',
    },
  };
  const selected = config[tone];
  return (
    <View style={[styles.notice, { backgroundColor: selected.background }]}>
      <Ionicons color={selected.color} name={selected.icon} size={20} />
      <Text style={[styles.noticeText, { color: selected.color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Palette.background,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  screenContent: {
    gap: 22,
    paddingBottom: 132,
    paddingHorizontal: 18,
  },
  pageHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  pageHeaderText: {
    flex: 1,
    gap: 5,
  },
  eyebrow: {
    color: Palette.green,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  pageTitle: {
    color: Palette.black,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  pageSubtitle: {
    color: Palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  hero: {
    borderRadius: 28,
    gap: 8,
    minHeight: 210,
    overflow: 'hidden',
    padding: 22,
    ...Shadow.floating,
  },
  heroOrbOne: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 100,
    height: 160,
    position: 'absolute',
    right: -50,
    top: -55,
    width: 160,
  },
  heroOrbTwo: {
    backgroundColor: 'rgba(141,255,203,0.1)',
    borderRadius: 70,
    bottom: -52,
    height: 140,
    left: 50,
    position: 'absolute',
    width: 140,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    marginBottom: 5,
    width: 44,
  },
  heroEyebrow: {
    color: '#BDEDD9',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: Palette.white,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 32,
    maxWidth: '88%',
  },
  heroSubtitle: {
    color: '#D8F4E8',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: '92%',
  },
  sectionHeading: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  sectionHeadingText: {
    flex: 1,
    gap: 3,
  },
  sectionTitle: {
    color: Palette.black,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    color: Palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  metricCard: {
    backgroundColor: Palette.card,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    flex: 1,
    gap: 7,
    minHeight: 144,
    padding: 16,
    ...Shadow.card,
  },
  metricIcon: {
    alignItems: 'center',
    borderRadius: 13,
    height: 39,
    justifyContent: 'center',
    marginBottom: 3,
    width: 39,
  },
  metricValue: {
    color: Palette.black,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  metricLabel: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderColor: Palette.border,
    borderRadius: 19,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 13,
  },
  quickActionIcon: {
    alignItems: 'center',
    borderRadius: 13,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  quickActionLabel: {
    color: Palette.black,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  statusPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusDot: {
    borderRadius: 4,
    height: 6,
    width: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  projectCard: {
    backgroundColor: Palette.card,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 11,
    padding: 17,
    ...Shadow.card,
  },
  projectTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectIcon: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  projectTitle: {
    color: Palette.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    lineHeight: 23,
  },
  projectDescription: {
    color: Palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  projectMetaRow: {
    alignItems: 'center',
    borderTopColor: Palette.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
  },
  projectMeta: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  projectMetaText: {
    color: Palette.muted,
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  fieldGroup: {
    gap: 7,
  },
  fieldLabel: {
    color: Palette.black,
    fontSize: 13,
    fontWeight: '800',
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.input,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 15,
  },
  inputShellMultiline: {
    alignItems: 'flex-start',
    minHeight: 118,
    paddingTop: 15,
  },
  input: {
    color: Palette.black,
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: Radius.button,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    minHeight: 55,
    paddingHorizontal: 20,
    ...Shadow.card,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '900',
  },
  textButton: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textButtonLabel: {
    color: Palette.green,
    fontSize: 14,
    fontWeight: '800',
  },
  stateCard: {
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 12,
    justifyContent: 'center',
    minHeight: 230,
    padding: 24,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: Palette.greenSoft,
    borderRadius: 22,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  stateTitle: {
    color: Palette.black,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  stateMessage: {
    color: Palette.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  notice: {
    alignItems: 'flex-start',
    borderRadius: Radius.input,
    flexDirection: 'row',
    gap: 10,
    padding: 13,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.55,
  },
});
