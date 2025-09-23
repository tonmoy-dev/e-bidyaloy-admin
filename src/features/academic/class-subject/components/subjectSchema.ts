// subject.schema.ts
import * as yup from 'yup';
import { SubjectTypeEnum } from '../models/subject.model';

export const subjectSchema = yup.object({
  id: yup.string().optional(),
  name: yup
    .string()
    .required('Subject name is required')
    .min(2, 'Subject name must be at least 2 characters')
    .max(100, 'Subject name must be less than 100 characters'),
  code: yup
    .string()
    .required('Subject code is required')
    .min(2, 'Subject code must be at least 2 characters')
    .max(20, 'Subject code must be less than 20 characters')
    .matches(
      /^[A-Za-z0-9-_]+$/,
      'Subject code can only contain letters, numbers, hyphens, and underscores',
    ),
  description: yup.string().optional().max(500, 'Description must be less than 500 characters'),
  subject_type: yup
    .mixed<SubjectTypeEnum>()
    .oneOf(Object.values(SubjectTypeEnum))
    .required('Subject type is required'),
  is_active: yup.boolean().default(true),
  organization: yup.string().optional(),
  organization_name: yup.string().optional(),
  teacher_count: yup.number().optional(),
  created_at: yup.string().optional(),
});
