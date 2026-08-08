import { Ionicons } from '@expo/vector-icons';
import { type Href, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  AppScreen,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  PrimaryButton,
  ProjectCard,
} from '@/components/app-ui';
import { Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { extractProjects } from '@/lib/data';

type NgoView = 'active' | 'applications' | 'completed' | 'opportunities';

export default function ProjectsScreen() {
  const { session } = useAuth();
  const role = session?.user.role || 'donor';
  const isNgo = role === 'NGO';
  const [view, setView] = useState<NgoView>(isNgo ? 'opportunities' : 'active');
  const [search, setSearch] = useState('');

  const endpoint = isNgo
    ? view === 'opportunities'
      ? '/allprojects'
      : view === 'applications'
        ? '/ngo/projects/applications'
        : view === 'completed'
          ? '/ngo/projects/completed'
          : '/ngo/projects/active'
    : role === 'admin'
      ? '/allprojects'
      : '/auth/donor/projects';
  const query = isNgo && view === 'opportunities'
    ? { limit: 30, status: 'brief' }
    : role === 'admin'
      ? { limit: 30, projectType: 'present' }
      : undefined;
  const projectsQuery = useApiQuery<unknown>(endpoint, { query });
  const projects = useMemo(() => {
    const items = extractProjects(projectsQuery.data);
    if (!search.trim()) return items;
    const term = search.trim().toLowerCase();
    return items.filter(
      (item) =>
        item.title?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term),
    );
  }, [projectsQuery.data, search]);

  return (
    <AppScreen
      onRefresh={() => void projectsQuery.refetch()}
      refreshing={projectsQuery.loading}>
      <PageHeader
        action={
          !isNgo ? (
            <Pressable
              onPress={() => router.push('/projects/create' as Href)}
              style={styles.addButton}>
              <Ionicons color={Palette.white} name="add" size={24} />
            </Pressable>
          ) : undefined
        }
        eyebrow={isNgo ? 'Opportunity hub' : role === 'admin' ? 'Platform portfolio' : 'Impact portfolio'}
        subtitle={
          isNgo
            ? 'Find the right brief, track applications, and deliver active work.'
            : 'Create briefs, select partners, and follow delivery from one place.'
        }
        title={isNgo ? 'Briefs & projects' : 'Projects'}
      />

      {isNgo ? (
        <View style={styles.tabs}>
          {(
            [
              ['opportunities', 'Discover'],
              ['applications', 'Applied'],
              ['active', 'Active'],
              ['completed', 'Done'],
            ] as const
          ).map(([value, label]) => (
            <Pressable
              key={value}
              onPress={() => setView(value)}
              style={[styles.tab, view === value && styles.tabActive]}>
              <Text style={[styles.tabText, view === value && styles.tabTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.search}>
        <Ionicons color={Palette.muted} name="search-outline" size={20} />
        <TextInput
          onChangeText={setSearch}
          placeholder="Search projects, causes, or locations"
          placeholderTextColor={Palette.mutedLight}
          style={styles.searchInput}
          value={search}
        />
        {search ? (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons color={Palette.muted} name="close-circle" size={19} />
          </Pressable>
        ) : null}
      </View>

      {projectsQuery.loading ? (
        <LoadingState label="Loading projects…" />
      ) : projectsQuery.error ? (
        <ErrorState message={projectsQuery.error} onRetry={() => void projectsQuery.refetch()} />
      ) : projects.length === 0 ? (
        <EmptyState
          action={
            !isNgo ? (
              <PrimaryButton
                icon="add"
                label="Create your first project"
                onPress={() => router.push('/projects/create' as Href)}
              />
            ) : undefined
          }
          icon="folder-open-outline"
          message={
            search
              ? 'Try a different search term.'
              : isNgo
                ? 'New matched opportunities will appear here as donors publish them.'
                : 'Start with a brief and invite the right NGO partners.'
          }
          title={search ? 'No matches found' : 'Nothing here yet'}
        />
      ) : (
        <View style={styles.list}>
          {projects.map((project) => (
            <ProjectCard
              item={project}
              key={project.id}
              onPress={() =>
                router.push(
                  (isNgo && view === 'opportunities'
                    ? `/briefs/${project.id}`
                    : `/projects/${project.id}`) as Href,
                )
              }
            />
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: Palette.green,
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  tabs: {
    backgroundColor: '#EAF1ED',
    borderRadius: 17,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 13,
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  tabActive: {
    backgroundColor: Palette.white,
  },
  tabText: {
    color: Palette.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  tabTextActive: {
    color: Palette.green,
  },
  search: {
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.input,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    minHeight: 54,
    paddingHorizontal: 15,
  },
  searchInput: {
    color: Palette.black,
    flex: 1,
    fontSize: 14,
  },
  list: {
    gap: 13,
  },
});
