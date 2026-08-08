import type { ProjectLike } from '@/components/app-ui';

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function getString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export function getNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function getNested(record: Record<string, unknown>, path: string[]) {
  let value: unknown = record;
  for (const key of path) {
    value = asRecord(value)[key];
  }
  return value;
}

export function getMetricValue(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (value && typeof value === 'object') {
    return asRecord(value).value ?? 0;
  }
  return value ?? 0;
}

export function extractCollection(value: unknown, keys: string[]): unknown[] {
  if (Array.isArray(value)) return value;
  const record = asRecord(value);
  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  if (record.data && typeof record.data === 'object') {
    const nested = asRecord(record.data);
    for (const key of keys) {
      if (Array.isArray(nested[key])) return nested[key] as unknown[];
    }
    if (Array.isArray(record.data)) return record.data;
  }
  return [];
}

export function toProject(value: unknown): ProjectLike {
  const record = asRecord(value);
  return {
    category: getString(record.category),
    cost: getNumber(record.cost ?? record.budget ?? record.target_amount),
    description: getString(record.description ?? record.scope),
    endDate: getString(record.endDate ?? record.end_date),
    id: getString(record.id) || getNumber(record.id),
    image: getString(record.image ?? record.filename),
    state: getString(record.state ?? record.location),
    status: getString(record.status, 'active'),
    title: getString(record.title ?? record.name, 'Untitled project'),
  };
}

export function extractProjects(value: unknown) {
  return extractCollection(value, [
    'projects',
    'activeProjects',
    'completedProjects',
    'applications',
    'data',
  ]).map(toProject);
}
