export interface ExamTypeModel {
  id?: string;
  name: string;
  description: string;
  weightage: string;
  is_active: boolean;
  organization?: string;
  organization_name?: string;
  exam_count?: string;
  created_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CreateExamTypeRequest {
  name: string;
  description: string;
  weightage: string;
  is_active: boolean;
  organization: string;
}