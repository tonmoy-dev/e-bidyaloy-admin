export interface ClassModel {
  id?: number;
  name: string;
  is_active: boolean;
  academic_year: string;
  academic_year_name?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}