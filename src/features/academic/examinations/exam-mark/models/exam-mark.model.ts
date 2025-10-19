export interface ExamMarkModel {
  id: string;
  exam: string; // UUID of the exam
  exam_name?: string; // For display purposes
  subject: string; // UUID of the subject
  subject_name?: string; // For display purposes
  class: string; // UUID of the class
  class_name?: string; // For display purposes
  section?: string; // UUID of the section (optional)
  section_name?: string; // For display purposes
  student: string; // UUID of the student
  student_name?: string; // For display purposes
  student_roll?: string; // Student roll number
  marks_obtained: number;
  total_marks: number;
  grade?: string;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateExamMarkRequest {
  exam: string;
  subject: string;
  class: string;
  section?: string;
  student: string;
  marks_obtained: number;
  total_marks: number;
  grade?: string;
  remarks?: string;
}

export interface UpdateExamMarkRequest {
  marks_obtained?: number;
  total_marks?: number;
  grade?: string;
  remarks?: string;
}

export interface BulkExamMarkRequest {
  exam: string;
  subject: string;
  class: string;
  section?: string;
  marks: Array<{
    student: string;
    marks_obtained: number;
    total_marks: number;
    grade?: string;
    remarks?: string;
  }>;
}

export interface ExamMarkFormData {
  exam: string;
  subject: string;
  class: string;
  section?: string;
  studentMarks: Array<{
    student: string;
    student_name: string;
    student_roll: string;
    marks_obtained: number;
    total_marks: number;
    grade?: string;
    remarks?: string;
  }>;
}