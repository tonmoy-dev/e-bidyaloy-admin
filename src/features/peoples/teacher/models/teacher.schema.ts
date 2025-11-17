import * as yup from 'yup';
import type { TeacherModel } from './teacher.model';

export const teacherSchema: yup.ObjectSchema<TeacherModel> = yup.object({
  id: yup.number().optional(),
  first_name: yup.string().required('First Name is required'),
  last_name: yup.string().required('Last Name is required'),
  username: yup.string().required('username is required'),
  password: yup.string().optional().min(6, 'Password must be at least 6 characters'),
  phone: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  date_of_birth: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  address: yup.string().required('Address is required'),
  profile_picture_url: yup.string().optional(),
  department: yup.string().required('Department is required'),
  designation: yup.string().required('Designation is required'),
  hire_date: yup.string().required('Hire date is required'),
  employment_type: yup.string().required('Employment type is required'),
  emergency_contact_name: yup.string().required('Emergency contact name is required'),
  emergency_contact_phone: yup.string().required('Emergency contact phone is required'),
  qualifications: yup.string().required('Qualifications are required'),
  experience_years: yup.number().min(0).required('Experience years is required'),
  termination_date: yup.string().optional(),
  termination_reason: yup.string().optional(),
  is_active: yup.boolean().required(),
});
