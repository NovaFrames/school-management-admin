export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role: string;
  organization_id?: string | null;
}

export interface RegisterResponse {
  token: string;
  user: User;
}
