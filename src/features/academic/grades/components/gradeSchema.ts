import * as yup from 'yup';

export const gradeSchema = yup.object({
  id: yup.string().optional(),
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  level: yup
    .number()
    .required('Level is required')
    .min(1, 'Level must be at least 1')
    .max(20, 'Level must be less than or equal to 20')
    .integer('Level must be a whole number'),
  description: yup.string().required('Description is required').max(500, 'Description must be less than 500 characters'),
  is_active: yup.boolean().required('Active status is required'),
  created_at: yup.string().optional(),
  updated_at: yup.string().optional(),
});
