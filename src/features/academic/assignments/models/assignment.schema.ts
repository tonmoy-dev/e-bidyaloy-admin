import * as yup from 'yup';

export const assignmentSchema = yup.object().shape({
  title: yup.string().required('Title is required').min(2, 'Title must be at least 2 characters'),
  description: yup.string().required('Description is required'),
  instructions: yup.string().required('Instructions are required'),
  target_type: yup
    .string()
    .oneOf(['class', 'section', 'individual'])
    .required('Target type is required'),
  class_assigned: yup.string().required('Class is required'),
  section: yup.string().when('target_type', {
    is: (val: string) => val === 'section' || val === 'individual',
    then: (schema) => schema.required('Section is required'),
    otherwise: (schema) => schema.optional(),
  }),
  subject: yup.string().required('Subject is required'),
  total_marks: yup.string().required('Total marks is required'),
  assigned_by: yup.string().required('Teacher is required'),
  due_date: yup.string().required('Due date is required'),
  status: yup.string().oneOf(['draft', 'published', 'closed']).required('Status is required'),
  academic_year: yup.string().required('Academic year is required'),
  student_ids: yup.array().when('target_type', {
    is: 'individual',
    then: (schema) => schema.min(1, 'At least one student must be selected'),
    otherwise: (schema) => schema.optional(),
  }),
  attachments: yup.array().of(yup.string().required()).optional(),
});
