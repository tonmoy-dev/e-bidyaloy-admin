import * as yup from 'yup';
import type { StudentTypeFormData } from './studentType.model';

export const studentTypeSchema: yup.ObjectSchema<StudentTypeFormData> = yup.object().shape({
  name: yup
    .string()
    .required('Student type name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  description: yup.string().max(200, 'Description must not exceed 200 characters').optional(),
  status: yup
    .mixed<'active' | 'inactive'>()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .optional(),
});
