import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type MobileRoute = {
  description: string;
  icon: IconName;
  name: string;
  path: string;
  role: 'ngo' | 'donor';
};

export const ngoRoutes: MobileRoute[] = [
  {
    description: 'Overview, tasks, project performance, and quick actions.',
    icon: 'grid-outline',
    name: 'Dashboard',
    path: '/ngo/dashboard',
    role: 'ngo',
  },
  {
    description: 'View assigned projects and open project details.',
    icon: 'folder-open-outline',
    name: 'Projects',
    path: '/ngo/projects',
    role: 'ngo',
  },
  {
    description: 'Track incoming briefs and respond from mobile.',
    icon: 'clipboard-outline',
    name: 'Briefs',
    path: '/ngo/briefs',
    role: 'ngo',
  },
  {
    description: 'Wallet, incoming donations, withdrawals, and disbursement history.',
    icon: 'wallet-outline',
    name: 'Funds',
    path: '/ngo/fund_management',
    role: 'ngo',
  },
  {
    description: 'Conversations with donors, corporate sponsors, and admins.',
    icon: 'mail-outline',
    name: 'Messages',
    path: '/ngo/messages',
    role: 'ngo',
  },
  {
    description: 'Organization profile, bank details, security, and support.',
    icon: 'person-outline',
    name: 'Profile',
    path: '/ngo/profile',
    role: 'ngo',
  },
];

export const donorRoutes: MobileRoute[] = [
  {
    description: 'Portfolio overview, active commitments, and pending actions.',
    icon: 'grid-outline',
    name: 'Dashboard',
    path: '/donor/dashboard',
    role: 'donor',
  },
  {
    description: 'Browse verified NGOs and open NGO detail pages.',
    icon: 'search-outline',
    name: 'NGOs',
    path: '/donor/ngo_directory',
    role: 'donor',
  },
  {
    description: 'Manage briefs, funded projects, milestones, and project updates.',
    icon: 'folder-outline',
    name: 'Briefs/Projects',
    path: '/donor/projects',
    role: 'donor',
  },
  {
    description: 'Fund wallets, disburse project funds, and review contributions.',
    icon: 'card-outline',
    name: 'Funds/Disbursement',
    path: '/donor/fund_management',
    role: 'donor',
  },
  {
    description: 'Impact reports, donations, and project performance snapshots.',
    icon: 'bar-chart-outline',
    name: 'Reports',
    path: '/donor/reports',
    role: 'donor',
  },
  {
    description: 'Account settings, corporate profile, notifications, and support.',
    icon: 'settings-outline',
    name: 'Settings',
    path: '/donor/profile',
    role: 'donor',
  },
];
