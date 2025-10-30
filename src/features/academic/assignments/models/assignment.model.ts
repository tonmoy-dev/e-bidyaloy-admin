export interface AssignedStudent {
  id: string;
  assignment: string;
  student: string;
  student_name: string;
  student_id: string;
  created_at: string;
}

export interface SubmissionStats {
  total: number;
  submitted: number;
  graded: number;
  pending: number;
}

export interface AssignmentAttachment {
  id: string;
  assignment: string;
  submission: string | null;
  attachment_type: 'assignment';
  file_name: string;
  file: string;
  file_url: string | null;
  file_size: number;
  created_at: string;
}

export interface AssignmentModel {
  id?: string;
  title: string;
  description: string;
  instructions: string;
  target_type: 'class' | 'section' | 'individual';
  class_assigned: string;
  class_name?: string;
  section?: string;
  section_name?: string;
  subject: string;
  subject_name?: string;
  total_marks: string;
  assigned_by: string;
  assigned_by_name?: string;
  assigned_date?: string;
  due_date: string;
  status: 'draft' | 'published' | 'closed';
  organization?: string;
  organization_name?: string;
  academic_year: string;
  academic_year_name?: string;
  attachments?: AssignmentAttachment[];
  assigned_students?: AssignedStudent[];
  submission_stats?: SubmissionStats;
  student_ids?: string[]; // Keep for backward compatibility
  created_at?: string;
  updated_at?: string;
}

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  instructions: string;
  target_type: 'class' | 'section' | 'individual';
  class_assigned: string;
  section?: string;
  subject: string;
  total_marks: string;
  assigned_by: string;
  due_date: string;
  status: 'draft' | 'published' | 'closed';
  academic_year: string;
  student_ids?: string[];
  attachments?: string[]; // Array of attachment IDs
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AssignmentFormData {
  title: string;
  description: string;
  instructions: string;
  target_type: 'class' | 'section' | 'individual';
  class_assigned: string;
  section?: string; // Optional since it's conditional in schema
  subject: string;
  total_marks: string;
  assigned_by: string;
  due_date: string;
  status: 'draft' | 'published' | 'closed';
  academic_year: string;
  student_ids?: string[]; // Optional since it's conditional in schema
  attachments?: string[]; // Array of attachment IDs for submission
}
