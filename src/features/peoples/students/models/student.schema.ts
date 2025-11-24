import * as yup from 'yup';

export const studentSchema = yup.object({
  first_name: yup.string().required('First Name is required'),
  last_name: yup.string().required('Last Name is required'),
  gender: yup
    .mixed<'male' | 'female' | 'other'>()
    .oneOf(['male', 'female', 'other'])
    .required('Gender is required'),
  student_id: yup.string().required('Student ID is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  admission_number: yup.string().required('Admission Number is required'),
  admission_date: yup.string().required('Admission Date is required'),
  roll_number: yup.string().required('Roll Number is required'),
  status: yup
    .mixed<'active' | 'inactive'>()
    .oneOf(['active', 'inactive'])
    .required('Status is required'),
  type: yup.string().optional(),
  class_assigned: yup.string().required('Class is required'),
  section: yup.string().required('Section is required'),
});
