import { Ionicons } from '@expo/vector-icons';
import { type Href, router } from 'expo-router';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Palette } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';

type RouteSnapshot = {
  name: string;
  state?: {
    index?: number;
    routes?: RouteSnapshot[];
  };
};

type BackDestination = {
  href: Href;
  label: string;
};

function getDeepestRouteName(route?: RouteSnapshot): string | null {
  if (!route) return null;
  const routes = route.state?.routes;
  if (!routes?.length) return route.name;
  const index = route.state?.index ?? routes.length - 1;
  return getDeepestRouteName(routes[index]) || route.name;
}

function getRouteLabel(routeName: string | null, isNgo: boolean) {
  if (!routeName) return null;

  const labels: Record<string, string> = {
    '(tabs)': 'Home',
    'applications/[projectId]': 'Applications',
    'briefs/[id]': 'Funding brief',
    'chats/[id]': 'Conversation',
    'ngos/[id]': 'NGO profile',
    'ngos/index': 'NGO directory',
    'projects/[id]': 'Project',
    'projects/[id]/milestones': 'Milestones',
    'projects/create': 'Create project',
    funds: 'Funds',
    index: 'Home',
    messages: 'Inbox',
    notifications: 'Notifications',
    profile: 'Account',
    projects: isNgo ? 'Briefs' : 'Projects',
    reports: 'Reports',
    'settings/bank': 'Bank accounts',
    'settings/profile': 'Edit profile',
    'settings/security': 'Security',
    'settings/support': 'Support',
  };

  return labels[routeName] || null;
}

function getFallbackDestination(currentRoute: string, isNgo: boolean): BackDestination {
  if (currentRoute.startsWith('settings/')) {
    return { href: '/(tabs)/profile', label: 'Account' };
  }
  if (currentRoute === 'chats/[id]') {
    return { href: '/(tabs)/messages', label: 'Inbox' };
  }
  if (currentRoute === 'ngos/[id]') {
    return { href: '/ngos', label: 'NGO directory' };
  }
  if (
    currentRoute.startsWith('projects/') ||
    currentRoute === 'briefs/[id]' ||
    currentRoute === 'applications/[projectId]'
  ) {
    return { href: '/(tabs)/projects', label: isNgo ? 'Briefs' : 'Projects' };
  }
  return { href: '/(tabs)', label: 'Home' };
}

export function AppBackButton({ currentRoute }: { currentRoute: string }) {
  const navigation = useNavigation();
  const { session } = useAuth();
  const isNgo = session?.user.role === 'NGO';
  const previousRouteName = useNavigationState((state) => {
    const previousRoute = state.routes[state.index - 1] as RouteSnapshot | undefined;
    return getDeepestRouteName(previousRoute);
  });
  const fallback = getFallbackDestination(currentRoute, isNgo);
  const label = getRouteLabel(previousRouteName, isNgo) || fallback.label;

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    router.replace(fallback.href);
  };

  return (
    <Pressable
      accessibilityLabel={`Back to ${label}`}
      accessibilityRole="button"
      hitSlop={10}
      onPress={goBack}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Ionicons color={Palette.greenDeep} name="chevron-back" size={26} />
      <Text numberOfLines={1} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: -8,
    maxWidth: 132,
    minHeight: 44,
    paddingHorizontal: 3,
  },
  label: {
    color: Palette.greenDeep,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: -2,
    maxWidth: 102,
  },
  pressed: {
    opacity: 0.45,
  },
});
