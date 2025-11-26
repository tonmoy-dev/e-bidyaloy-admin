// schemas/attendance.schema.ts
import * as yup from 'yup';
import type { AttendanceBulkPayload, AttendanceStudentEntry } from './attendance.model';

// Schema for individual student attendance entry
export const attendanceStudentEntrySchema: yup.ObjectSchema<AttendanceStudentEntry> = yup.object({
  student_id: yup
    .string()
    .required('Student ID is required')
    .uuid('Student ID must be a valid UUID'),

  status: yup
    .mixed<'present' | 'absent' | 'late' | 'excused'>()
    .oneOf(['present', 'absent', 'late', 'excused'], 'Please select a valid attendance status')
    .required('Attendance status is required'),

  remarks: yup.string().optional().max(500, 'Remarks cannot exceed 500 characters'),
});

// Schema for bulk attendance marking
export const bulkAttendanceSchema: yup.ObjectSchema<AttendanceBulkPayload> = yup.object({
  class_id: yup.string().required('Class is required').uuid('Class ID must be a valid UUID'),

  section_id: yup.string().required('Section is required').uuid('Section ID must be a valid UUID'),

  subject_id: yup.string().required('Subject is required').uuid('Subject ID must be a valid UUID'),

  attendance_date: yup
    .string()
    .required('Attendance date is required')
    .test('is-valid-date', 'Please provide a valid date (YYYY-MM-DD)', (value) => {
      if (!value) return false;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      return dateRegex.test(value) && !isNaN(Date.parse(value));
    })
    .test('not-future-date', 'Attendance date cannot be in the future', (value) => {
      if (!value) return true;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }),

  students: yup
    .array()
    .of(attendanceStudentEntrySchema)
    .required('At least one student is required')
    .min(1, 'At least one student is required')
    .test('unique-students', 'Duplicate student IDs found', (value) => {
      if (!value) return true;
      const studentIds = value.map((s) => s.student_id);
      return studentIds.length === new Set(studentIds).size;
    }),
});

// Schema for updating single student attendance
export const updateStudentAttendanceSchema = yup.object({
  status: yup
    .mixed<'present' | 'absent' | 'late' | 'excused'>()
    .oneOf(['present', 'absent', 'late', 'excused'], 'Please select a valid attendance status')
    .required('Attendance status is required'),

  remarks: yup.string().optional().max(500, 'Remarks cannot exceed 500 characters'),
});

// Schema for attendance query filters
export const attendanceFilterSchema = yup.object({
  class_id: yup.string().uuid('Invalid class ID').optional(),
  section_id: yup.string().uuid('Invalid section ID').optional(),
  subject_id: yup.string().uuid('Invalid subject ID').optional(),
  attendance_date: yup
    .string()
    .optional()
    .test('is-valid-date', 'Invalid date format', (value) => {
      if (!value) return true;
      return !isNaN(Date.parse(value));
    }),
  status: yup
    .mixed<'present' | 'absent' | 'late' | 'excused'>()
    .oneOf(['present', 'absent', 'late', 'excused'])
    .optional(),
  page: yup.number().positive().integer().optional(),
  page_size: yup.number().positive().integer().max(100).optional(),
});
