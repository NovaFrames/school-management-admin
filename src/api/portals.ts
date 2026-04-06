import { requestJson } from './http';
import type { ApiResult, Portal, UserPortalAccess } from '../types/portal';

function ensureSuccess<T>(res: ApiResult<T>, fallbackMessage: string): T {
  if (!res.success) throw new Error(res.message || fallbackMessage);
  if (typeof res.data === 'undefined' || res.data === null) {
    throw new Error(res.message || fallbackMessage);
  }
  return res.data;
}

export async function getPortals(): Promise<Portal[]> {
  const res = await requestJson<ApiResult<Portal[]>>('/portals', { method: 'GET' });
  if (!res.success) throw new Error(res.message || 'Failed to fetch portals');
  return Array.isArray(res.data) ? res.data : [];
}

export async function createPortal(code: string, display_name: string): Promise<Portal> {
  const res = await requestJson<ApiResult<Portal>>('/portals', {
    method: 'POST',
    body: JSON.stringify({ code, display_name }),
  });
  return ensureSuccess(res, 'Failed to create portal');
}

export async function getPortalById(id: string): Promise<Portal> {
  const res = await requestJson<ApiResult<Portal>>('/portals/by-id', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
  return ensureSuccess(res, 'Failed to fetch portal');
}

export async function updatePortalById(
  id: string,
  payload: { code?: string; display_name?: string },
): Promise<Portal> {
  const res = await requestJson<ApiResult<Portal>>('/portals', {
    method: 'PUT',
    body: JSON.stringify({ id, ...payload }),
  });
  return ensureSuccess(res, 'Failed to update portal');
}

export async function deletePortalById(id: string): Promise<Portal> {
  const res = await requestJson<ApiResult<Portal>>('/portals', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
  return ensureSuccess(res, 'Failed to delete portal');
}

export async function grantUserPortalAccess(user_id: string, portal_code: string): Promise<{
  message: string;
  data?: UserPortalAccess;
}> {
  const res = await requestJson<ApiResult<UserPortalAccess>>('/user-portals', {
    method: 'POST',
    body: JSON.stringify({ user_id, portal_code }),
  });

  if (!res.success) throw new Error(res.message || 'Failed to grant portal access');
  return { message: res.message || 'Portal access granted', data: res.data };
}

export async function getUserPortalAccess(user_id: string): Promise<UserPortalAccess[]> {
  const qs = new URLSearchParams({ user_id });
  const res = await requestJson<ApiResult<UserPortalAccess[]>>(`/user-portals?${qs.toString()}`, {
    method: 'GET',
  });
  if (!res.success) throw new Error(res.message || 'Failed to fetch user portal access');
  return Array.isArray(res.data) ? res.data : [];
}

export async function updateUserPortalAccess(access_id: string, portal_code: string): Promise<UserPortalAccess> {
  const res = await requestJson<ApiResult<UserPortalAccess>>('/user-portals', {
    method: 'PUT',
    body: JSON.stringify({ access_id, portal_code }),
  });
  return ensureSuccess(res, 'Failed to update portal access');
}

export async function revokeUserPortalAccess(access_id: string): Promise<UserPortalAccess> {
  const res = await requestJson<ApiResult<UserPortalAccess>>('/user-portals', {
    method: 'DELETE',
    body: JSON.stringify({ access_id }),
  });
  return ensureSuccess(res, 'Failed to revoke portal access');
}
