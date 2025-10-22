import * as yup from 'yup';

export const examSubjectSchema = yup.object().shape({
  subject: yup.string().required('Subject is required'),
  exam_date: yup.string().required('Exam date is required'),
  start_time: yup.string().required('Start time is required'),
  duration_minutes: yup.number()
    .min(1, 'Duration must be at least 1 minute')
    .required('Duration is required'),
  max_marks: yup.string().required('Max marks is required'),
  passing_marks: yup.string().required('Passing marks is required'),
  room_number: yup.string().optional(),
  supervisor: yup.string().optional(),
  instructions: yup.string().optional(),
  status: yup.string().oneOf(['scheduled', 'active', 'completed', 'cancelled']).required('Status is required'),
});

export const examSchema = yup.object().shape({
  name: yup.string().required('Exam name is required'),
  description: yup.string().required('Description is required'),
  start_date: yup.string().required('Start date is required'),
  end_date: yup.string().required('End date is required'),
  result_publish_date: yup.string().required('Result publish date is required'),
  status: yup.string().oneOf(['scheduled', 'active', 'completed', 'cancelled']).required('Status is required'),
  instructions: yup.string().optional(),
  academic_year: yup.string().required('Academic year is required'),
  exam_type: yup.string().required('Exam type is required'),
  class_obj: yup.string().required('Class is required'),
  section: yup.string().optional(),
  exam_subjects: yup.array().of(examSubjectSchema).min(1, 'At least one subject is required'),
});