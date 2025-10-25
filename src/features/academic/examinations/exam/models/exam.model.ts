export interface ExamSubjectModel {
  id?: string;
  exam_date: string;
  start_time: string;
  duration_minutes: number;
  max_marks: string;
  passing_marks: string;
  room_number?: string;
  instructions?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  exam?: string;
  exam_name?: string;
  subject: string;
  subject_name?: string;
  subject_code?: string;
  class_name?: string;
  section_name?: string;
  supervisor?: string;
  supervisor_name?: string;
  created_at?: string;
}

export interface ExamModel {
  id?: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  result_publish_date: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  instructions?: string;
  organization?: string;
  organization_name?: string;
  academic_year: string;
  academic_year_name?: string;
  exam_type: string;
  exam_type_name?: string;
  class_obj: string;
  class_name?: string;
  section?: string;
  section_name?: string;
  created_by?: string;
  created_by_name?: string;
  subject_count?: string;
  exam_subjects: ExamSubjectModel[];
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CreateExamSubjectRequest {
  id?: string;
  subject: string;
  exam_date: string;
  start_time: string;
  duration_minutes: number;
  max_marks: string;
  passing_marks: string;
  room_number?: string;
  supervisor?: string;
  instructions?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export interface CreateExamRequest {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  result_publish_date: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  instructions?: string;
  academic_year: string;
  exam_type: string;
  class_obj: string;
  section?: string;
  exam_subjects: CreateExamSubjectRequest[];
}