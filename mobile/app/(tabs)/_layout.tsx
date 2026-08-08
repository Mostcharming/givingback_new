import { Tabs } from 'expo-router';
import React from 'react';

import { LiquidGlassTabBar } from '@/components/liquid-glass-tab-bar';
import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { session } = useAuth();
  const isNgo = session?.user.role === 'NGO';

  return (
    <Tabs
      tabBar={(props) => <LiquidGlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color} name={focused ? 'home' : 'home-outline'} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: isNgo ? 'Briefs' : 'Projects',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? 'folder-open' : 'folder-open-outline'}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="funds"
        options={{
          title: 'Funds',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color} name={focused ? 'wallet' : 'wallet-outline'} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={color}
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color} name={focused ? 'person' : 'person-outline'} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
