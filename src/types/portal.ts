export interface Portal {
  id: string;
  code: string;
  display_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserPortalAccess {
  id: string;
  user_id: string;
  portal_id?: string;
  portal_code?: string;
  display_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResult<T> {
  success: boolean;
  message?: string;
  count?: number;
  data?: T;
}
