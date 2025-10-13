import * as yup from 'yup';

export enum SyllabusStatusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export const syllabusSchema = yup.object({
  id: yup.string().optional(),
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: yup.string().optional().max(500, 'Description must be less than 500 characters'),
  content: yup.string().optional().max(5000, 'Content must be less than 5000 characters'),
  file_url: yup.string().url('Must be a valid URL').optional().nullable(),
  pdf_file: yup.mixed().optional().nullable(),
  status: yup
    .mixed<SyllabusStatusEnum>()
    .oneOf(Object.values(SyllabusStatusEnum))
    .required('Status is required'),
  subject: yup.string().required('Subject selection is required'),
  classes: yup.string().required('Class selection is required'),
  created_at: yup.string().optional(),
  updated_at: yup.string().optional(),
});
