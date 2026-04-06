import { clearAuthSession, getAccessToken } from './session';

const API_BASE_URL = process.env.BASE_URL || 'http://localhost:5001/api';

function toApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return API_BASE_URL + path;
}

async function parseJson<T>(res: Response): Promise<T> {
  return (await res.json().catch(() => ({}))) as T;
}

export async function requestJson<T>(
  path: string,
  init: RequestInit = {},
  withAuth = true,
): Promise<T> {
  const headers = new Headers(init.headers ?? {});

  if (!headers.has('Content-Type') && init.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  if (withAuth) {
    const token = getAccessToken();
    if (token) headers.set('Authorization', 'Bearer ' + token);
  }

  const res = await fetch(toApiUrl(path), { ...init, headers });
  const data = await parseJson<T & { message?: string }>(res);

  if (!res.ok) {
    if (res.status === 401) clearAuthSession();
    const message = (data as { message?: string }).message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}
