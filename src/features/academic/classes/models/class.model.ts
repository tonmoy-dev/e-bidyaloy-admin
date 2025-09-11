export interface ClassModel {
  id?: number;
  name: string;
  class_teacher: string;
  sections?: SectionModel[];
  is_active?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SectionModel {
  id?: number;
  name: string;
  teacher: string;
  is_active?: boolean;
}









