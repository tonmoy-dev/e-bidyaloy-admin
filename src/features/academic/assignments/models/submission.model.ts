export interface AssignmentSubmission {
  id: string;
  assignment: string;
  student: string;
  submission_text: string;
  submitted_at: string;
  marks_obtained?: string | null;
  feedback?: string | null;
  graded_by?: string | null;
  graded_at?: string | null;
  status: 'pending' | 'submitted' | 'graded';
}

export interface CreateSubmissionRequest {
  assignment: string;
  student: string;
  submission_text: string;
  submitted_at: string;
  status: 'submitted';
}

export interface CreateSubmissionResponse {
  id: string;
  assignment: string;
  student: string;
  submission_text: string;
  submitted_at: string;
  marks_obtained?: string | null;
  feedback?: string | null;
  graded_by?: string | null;
  graded_at?: string | null;
  status: 'pending' | 'submitted' | 'graded';
}

export interface SubmissionAttachment {
  id: string;
  assignment: string;
  submission: string;
  attachment_type: 'submission';
  file_name: string;
  file: string;
  file_url?: string | null;
  file_size: number;
  created_at: string;
}

export interface CreateSubmissionAttachmentRequest {
  assignment: string;
  submission: string;
  attachment_type: 'submission';
  file_name: string;
  file: File;
  file_url?: string;
  file_size: number;
}
