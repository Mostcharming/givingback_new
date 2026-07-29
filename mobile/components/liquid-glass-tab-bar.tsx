import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACTIVE_COLOR = '#0B6B4D';
const INACTIVE_COLOR = '#607169';

type LiquidTabButtonProps = {
  accessibilityLabel?: string;
  focused: boolean;
  icon: BottomTabBarProps['descriptors'][string]['options']['tabBarIcon'];
  label: string;
  onLongPress: () => void;
  onPress: () => void;
  testID?: string;
};

function LiquidTabButton({
  accessibilityLabel,
  focused,
  icon,
  label,
  onLongPress,
  onPress,
  testID,
}: LiquidTabButtonProps) {
  const focusProgress = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const color = focused ? ACTIVE_COLOR : INACTIVE_COLOR;

  useEffect(() => {
    Animated.spring(focusProgress, {
      damping: 16,
      mass: 0.55,
      stiffness: 220,
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [focusProgress, focused]);

  const scale = focusProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });
  const translateY = focusProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      onLongPress={onLongPress}
      onPress={onPress}
      onPressIn={() => {
        if (Platform.OS !== 'web') {
          void Haptics.selectionAsync();
        }
      }}
      style={styles.tabButton}
      testID={testID}>
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [{ translateY }, { scale }],
          },
        ]}>
        {icon?.({ color, focused, size: 23 })}
        <Text numberOfLines={1} style={[styles.tabLabel, { color }]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function LiquidGlassTabBar({
  descriptors,
  navigation,
  state,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeIndex = useRef(new Animated.Value(state.index)).current;
  const [barWidth, setBarWidth] = useState(0);
  const segmentWidth = barWidth / state.routes.length;

  useEffect(() => {
    Animated.spring(activeIndex, {
      damping: 18,
      mass: 0.7,
      stiffness: 190,
      toValue: state.index,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, state.index]);

  const translateX = activeIndex.interpolate({
    inputRange: state.routes.map((_, index) => index),
    outputRange: state.routes.map((_, index) => index * segmentWidth + 4),
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[
        styles.positioner,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}>
      <View
        onLayout={handleLayout}
        style={[styles.shadowShell, styles.shadowShellLight]}>
        <View style={styles.glassClip}>
          <BlurView
            blurReductionFactor={3}
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            intensity={82}
            style={StyleSheet.absoluteFill}
            tint="systemUltraThinMaterialLight"
          />
          <View
            style={[StyleSheet.absoluteFill, styles.noPointerEvents, styles.glassWashLight]}
          />

          {barWidth > 0 ? (
            <Animated.View
              style={[
                styles.activeGlass,
                styles.noPointerEvents,
                styles.activeGlassLight,
                {
                  transform: [{ translateX }],
                  width: Math.max(segmentWidth - 8, 0),
                },
              ]}>
              <View style={styles.specularHighlight} />
              <View style={styles.liquidGlow} />
            </Animated.View>
          ) : null}

          <View style={styles.tabRow}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const focused = state.index === index;
              const label =
                typeof options.tabBarLabel === 'string'
                  ? options.tabBarLabel
                  : typeof options.title === 'string'
                    ? options.title
                    : route.name;

              const onPress = () => {
                const event = navigation.emit({
                  canPreventDefault: true,
                  target: route.key,
                  type: 'tabPress',
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  target: route.key,
                  type: 'tabLongPress',
                });
              };

              return (
                <LiquidTabButton
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  focused={focused}
                  icon={options.tabBarIcon}
                  key={route.key}
                  label={label}
                  onLongPress={onLongPress}
                  onPress={onPress}
                  testID={options.tabBarButtonTestID}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  positioner: {
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    pointerEvents: 'box-none',
    position: 'absolute',
    right: 0,
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
  shadowShell: {
    borderRadius: 38,
    height: 72,
  },
  shadowShellLight: {
    elevation: 14,
    shadowColor: '#0D3628',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  glassClip: {
    backgroundColor: 'rgba(238, 248, 243, 0.94)',
    borderRadius: 38,
    flex: 1,
    overflow: 'hidden',
  },
  glassWashLight: {
    backgroundColor: 'rgba(239, 250, 245, 0.68)',
  },
  activeGlass: {
    borderRadius: 31,
    borderWidth: 1,
    bottom: 5,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    top: 5,
  },
  activeGlassLight: {
    backgroundColor: 'rgba(236, 255, 247, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.96)',
    elevation: 5,
    shadowColor: '#0B6B4D',
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 9,
  },
  specularHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.66)',
    borderRadius: 4,
    height: 3,
    left: 18,
    position: 'absolute',
    right: 18,
    top: 4,
  },
  liquidGlow: {
    backgroundColor: 'rgba(111, 235, 183, 0.18)',
    borderRadius: 40,
    bottom: -28,
    height: 56,
    left: 8,
    position: 'absolute',
    right: 8,
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    gap: 3,
    justifyContent: 'center',
    minWidth: 54,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
