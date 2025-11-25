// models/attendance.model.ts
export type UUID = string;
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceStudentEntry {
  student_id: UUID;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceBulkPayload {
  class_id: UUID;
  section_id: UUID;
  subject_id: UUID;
  attendance_date: string; // ISO date string (YYYY-MM-DD)
  students: AttendanceStudentEntry[];
}

export interface StudentWithAttendance {
  id: UUID;
  name: string;
  roll: string;
  class_name: string;
  section_name: string;
  attendance_status?: AttendanceStatus;
  remarks?: string;
  created_at?: string; // ISO datetime
  updated_at?: string; // ISO datetime
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type StudentAttendancePaginatedResponse = PaginatedResponse<StudentWithAttendance>;

// Attendance status choices for dropdowns
export const ATTENDANCE_STATUS_CHOICES: Array<{ value: AttendanceStatus; label: string }> = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Late' },
  { value: 'excused', label: 'Excused' },
];

// Helper function to get status color/badge variant
export const getAttendanceStatusVariant = (status?: AttendanceStatus) => {
  switch (status) {
    case 'present':
      return 'success';
    case 'absent':
      return 'destructive';
    case 'late':
      return 'warning';
    case 'excused':
      return 'secondary';
    default:
      return 'outline';
  }
};
