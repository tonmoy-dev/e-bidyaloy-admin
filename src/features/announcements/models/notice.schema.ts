// schemas/notice.schema.ts
import * as yup from 'yup';
import type { NoticeModel } from './notice.model';

export const noticeSchema: yup.ObjectSchema<Omit<NoticeModel, 'id'>> = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),

  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),

  audience: yup
    .mixed<'global' | 'teachers' | 'students'>()
    .oneOf(['global', 'teachers', 'students'], 'Please select a valid audience')
    .required('Audience is required'),

  is_published: yup.boolean().optional(),

  expiry_date: yup
    .string()
    .optional()
    .test('is-datetime', 'Expiry date must be a valid datetime', (value) => {
      if (!value) return true;
      return !isNaN(Date.parse(value));
    }),

  attachment: yup.string().optional(),

  publish_date: yup
    .string()
    .optional()
    .test('is-datetime', 'Publish date must be a valid datetime', (value) => {
      if (!value) return true;
      return !isNaN(Date.parse(value));
    })
    .test('before-expiry', 'Publish date must be before expiry date', function (value) {
      const { expiry_date } = this.parent;
      if (!value || !expiry_date) return true;
      return new Date(value) < new Date(expiry_date);
    }),

  organization: yup.string().optional(),
  organization_name: yup.string().optional(),
  created_at: yup.string().optional(),
  updated_at: yup.string().optional(),
  created_by: yup.string().optional(),
  created_by_name: yup.string().optional(),
});

// Schema for creating a new notice (more strict validations)
export const createNoticeSchema = noticeSchema.shape({
  title: yup.string().required('Title is required').min(3).max(200),
  description: yup.string().required('Description is required').min(10),
  audience: yup
    .mixed<'global' | 'teachers' | 'students'>()
    .oneOf(['global', 'teachers', 'students'], 'Please select a valid audience')
    .required('Audience is required'),
});

// Schema for updating a notice (all fields optional except what you want to enforce)
export const updateNoticeSchema = yup.object({
  title: yup.string().min(3).max(200).optional(),
  description: yup.string().min(10).optional(),
  audience: yup
    .mixed<'global' | 'teachers' | 'students'>()
    .oneOf(['global', 'teachers', 'students'], 'Please select a valid audience')
    .optional(),
  is_published: yup.boolean().optional(),
  expiry_date: yup.string().optional(),
  attachment: yup.string().optional(),
  publish_date: yup.string().optional(),
});
