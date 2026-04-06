import type { ApiResult, Organization } from '../types/organization';
import { requestJson } from './http';

interface ListOrganizationsResponse {
  success: boolean;
  message?: string;
  count?: number;
  data?: Organization[];
}

function ensureSuccess<T>(res: ApiResult<T>): T {
  if (!res.success) {
    throw new Error(res.message || 'Request failed');
  }
  return res.data;
}

export async function getOrganizations(): Promise<Organization[]> {
  const res = await requestJson<ListOrganizationsResponse>('/getOrganizations', { method: 'GET' });
  if (!res.success) throw new Error(res.message || 'Failed to fetch organizations');
  return Array.isArray(res.data) ? res.data : [];
}

export async function createOrganization(org_name: string): Promise<Organization> {
  const res = await requestJson<ApiResult<Organization>>('/createOrganization', {
    method: 'POST',
    body: JSON.stringify({ org_name }),
  });
  return ensureSuccess(res);
}

export async function updateOrganizationById(id: string, org_name: string): Promise<Organization> {
  const res = await requestJson<ApiResult<Organization>>('/updateOrganizationById', {
    method: 'PUT',
    body: JSON.stringify({ id, org_name }),
  });
  return ensureSuccess(res);
}

export async function deleteOrganizationById(id: string): Promise<Organization> {
  const res = await requestJson<ApiResult<Organization>>('/deleteOrganizationById', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
  return ensureSuccess(res);
}
