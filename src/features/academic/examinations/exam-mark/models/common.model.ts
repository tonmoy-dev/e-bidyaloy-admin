export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ExamOption extends SelectOption {
  id: string;
  name: string;
  exam_date?: string;
}

export interface SubjectOption extends SelectOption {
  id: string;
  name: string;
  code: string;
}

export interface ClassOption extends SelectOption {
  id: string;
  name: string;
  code?: string;
}

export interface SectionOption extends SelectOption {
  id: string;
  name: string;
  class_id: string;
}

export interface StudentOption extends SelectOption {
  id: string;
  name: string;
  roll_number: string;
  class_id: string;
  section_id?: string;
}