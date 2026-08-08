import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { Palette } from '@/constants/design';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { initializing, session } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Palette.green} size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: Palette.background },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Palette.background },
          headerTintColor: Palette.greenDeep,
          headerTitleStyle: { fontWeight: '800' },
        }}>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={Boolean(session)}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="projects/[id]" options={{ title: 'Project' }} />
          <Stack.Screen name="projects/create" options={{ title: 'Create project' }} />
          <Stack.Screen
            name="projects/[id]/milestones"
            options={{ title: 'Milestones' }}
          />
          <Stack.Screen name="briefs/[id]" options={{ title: 'Funding brief' }} />
          <Stack.Screen name="ngos/index" options={{ title: 'NGO directory' }} />
          <Stack.Screen name="ngos/[id]" options={{ title: 'NGO profile' }} />
          <Stack.Screen name="chats/[id]" options={{ title: 'Conversation' }} />
          <Stack.Screen name="applications/[projectId]" options={{ title: 'Applications' }} />
          <Stack.Screen name="reports" options={{ title: 'Reports' }} />
          <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
          <Stack.Screen name="settings/security" options={{ title: 'Security' }} />
          <Stack.Screen name="settings/profile" options={{ title: 'Edit profile' }} />
          <Stack.Screen name="settings/bank" options={{ title: 'Bank accounts' }} />
          <Stack.Screen name="settings/support" options={{ title: 'Support' }} />
          <Stack.Screen name="payment-result" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: Palette.background,
    flex: 1,
    justifyContent: 'center',
  },
});
