export interface StudentType {
  id?: string;
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface StudentTypeFormData {
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
