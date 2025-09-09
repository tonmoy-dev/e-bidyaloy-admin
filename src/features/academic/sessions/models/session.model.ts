export interface SessionModel {
  id?: number;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}