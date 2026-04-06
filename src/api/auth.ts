import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  User,
} from '../types/auth';
import { requestJson } from './http';

const REQUIRED_LOGIN_PORTAL = 'ORG_ADMIN_PORTAL';

interface RawAuthResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  refresh_token?: string;
  portal?: string;
  portals?: Array<{
    portal_code?: string;
  }>;
  role?: string;
  user?: Partial<User>;
  data?: {
    token?: string;
    accessToken?: string;
    refreshToken?: string;
    refresh_token?: string;
    portal?: string;
    portals?: Array<{
      portal_code?: string;
    }>;
    role?: string;
    user?: Partial<User>;
  };
  message?: string;
}

function normalizeAuthResponse(raw: RawAuthResponse, fallbackEmail: string): {
  token: string;
  refreshToken?: string;
  user: User;
} {
  const nested = raw.data ?? {};
  const token = String(raw.token ?? raw.accessToken ?? nested.token ?? nested.accessToken ?? '').trim();
  const refreshToken = String(raw.refreshToken ?? raw.refresh_token ?? nested.refreshToken ?? nested.refresh_token ?? '').trim();

  if (!token) {
    throw new Error('Authentication succeeded but token was not returned');
  }

  const userInput = raw.user ?? nested.user;
  const role = String(userInput?.role ?? raw.role ?? nested.role ?? 'org_admin');
  const user: User = {
    id: String(userInput?.id ?? ''),
    email: String(userInput?.email ?? fallbackEmail),
    full_name: String(userInput?.full_name ?? fallbackEmail.split('@')[0] ?? 'Org Admin'),
    role,
  };

  return {
    token,
    refreshToken: refreshToken || undefined,
    user,
  };
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const raw = await requestJson<RawAuthResponse>(
    '/login/',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    false,
  );

  const nested = raw.data ?? {};
  const portal = String(raw.portal ?? nested.portal ?? raw.portals?.[0]?.portal_code ?? nested.portals?.[0]?.portal_code ?? '').trim();
  if (portal !== REQUIRED_LOGIN_PORTAL) {
    throw new Error('Invalid credentials');
  }

  return normalizeAuthResponse(raw, payload.email);
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const body = {
    ...payload,
    organization_id: payload.organization_id ? payload.organization_id : '',
  };
  const raw = await requestJson<RawAuthResponse>(
    '/register',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    false,
  );

  const normalized = normalizeAuthResponse(raw, payload.email);
  return {
    token: normalized.token,
    user: normalized.user,
  };
}
