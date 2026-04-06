export interface Organization {
  id: string;
  org_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResult<T> {
  success: boolean;
  message?: string;
  data: T;
}
