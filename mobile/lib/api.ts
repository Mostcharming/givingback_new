export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || 'https://api.givebackng.org/rest/v1'
).replace(/\/+$/, '');

export type QueryValue = boolean | number | string | null | undefined;

export class ApiError extends Error {
  data: unknown;
  status: number;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  body?: FormData | Record<string, unknown> | unknown[];
  method?: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
  token?: string | null;
};

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const endpoint = path.startsWith('/') ? path : `/${path}`;
  const entries = Object.entries(query || {}).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );
  const search = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  return `${API_BASE_URL}${endpoint}${search ? `?${search}` : ''}`;
}

function getErrorMessage(data: unknown, fallback: string) {
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const message = record.error || record.message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, method = 'GET', query, signal, token } = options;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isFormData) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      headers,
      method,
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new ApiError('Unable to reach GivingBack. Check your connection and try again.', 0);
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, `Request failed with status ${response.status}`),
      response.status,
      data,
    );
  }

  return data as T;
}

export function apiGet<T>(
  path: string,
  token?: string | null,
  query?: Record<string, QueryValue>,
  signal?: AbortSignal,
) {
  return apiRequest<T>(path, { query, signal, token });
}

export function apiPost<T>(
  path: string,
  body?: FormData | Record<string, unknown> | unknown[],
  token?: string | null,
) {
  return apiRequest<T>(path, { body, method: 'POST', token });
}

export function apiPut<T>(
  path: string,
  body?: FormData | Record<string, unknown> | unknown[],
  token?: string | null,
) {
  return apiRequest<T>(path, { body, method: 'PUT', token });
}

export function apiPatch<T>(
  path: string,
  body?: FormData | Record<string, unknown> | unknown[],
  token?: string | null,
) {
  return apiRequest<T>(path, { body, method: 'PATCH', token });
}

export function apiDelete<T>(
  path: string,
  body?: Record<string, unknown>,
  token?: string | null,
) {
  return apiRequest<T>(path, { body, method: 'DELETE', token });
}
