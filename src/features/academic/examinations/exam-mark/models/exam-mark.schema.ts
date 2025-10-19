import * as yup from 'yup';

export const examMarkSchema = yup.object({
  exam: yup.string().required('Exam is required'),
  subject: yup.string().required('Subject is required'),
  class: yup.string().required('Class is required'),
  section: yup.string().optional(),
  student: yup.string().required('Student is required'),
  marks_obtained: yup.number().min(0, 'Marks obtained must be non-negative').required(),
  total_marks: yup.number().min(1, 'Total marks must be greater than 0').required(),
  grade: yup.string().optional(),
  remarks: yup.string().optional(),
});

export const bulkExamMarkSchema = yup.object({
  exam: yup.string().required('Exam is required'),
  subject: yup.string().required('Subject is required'),
  class: yup.string().required('Class is required'),
  section: yup.string().optional(),
  marks: yup.array(
    yup.object({
      student: yup.string().required('Student is required'),
      marks_obtained: yup.number().min(0, 'Marks obtained must be non-negative').required(),
      total_marks: yup.number().min(1, 'Total marks must be greater than 0').required(),
      grade: yup.string().optional(),
      remarks: yup.string().optional(),
    })
  ).min(1, 'At least one student mark is required').required(),
});

export const examMarkFormSchema = yup.object({
  exam: yup.string().required('Exam is required'),
  subject: yup.string().required('Subject is required'),
  class: yup.string().required('Class is required'),
  section: yup.string().optional(),
  studentMarks: yup.array(
    yup.object({
      student: yup.string().required('Student is required'),
      student_name: yup.string().required(),
      student_roll: yup.string().required(),
      marks_obtained: yup.number().min(0, 'Marks obtained must be non-negative').required(),
      total_marks: yup.number().min(1, 'Total marks must be greater than 0').required(),
      grade: yup.string().optional(),
      remarks: yup.string().optional(),
    })
  ).min(1, 'At least one student mark is required').required(),
});

export type ExamMarkSchema = yup.InferType<typeof examMarkSchema>;
export type BulkExamMarkSchema = yup.InferType<typeof bulkExamMarkSchema>;
export type ExamMarkFormSchema = yup.InferType<typeof examMarkFormSchema>;