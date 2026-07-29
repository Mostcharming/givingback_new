import { Tabs } from 'expo-router';
import React from 'react';

import { LiquidGlassTabBar } from '@/components/liquid-glass-tab-bar';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
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
        name="ngo"
        options={{
          title: 'NGO',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color} name={focused ? 'business' : 'business-outline'} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="donor"
        options={{
          title: 'Donor',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color} name={focused ? 'briefcase' : 'briefcase-outline'} size={size} />
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
    </Tabs>
  );
}
