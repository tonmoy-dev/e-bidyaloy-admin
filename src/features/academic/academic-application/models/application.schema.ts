import * as yup from 'yup';
import type { ApplicationModel } from './application.model';

export const applicationSchema: yup.ObjectSchema<Omit<ApplicationModel, 'id'>> = yup.object({
  //   applicant: yup.string().required('Applicant is required').uuid('Applicant must be a valid UUID'),

  application_type: yup
    .mixed<'leave' | 'request' | 'other'>()
    .oneOf(['leave', 'request', 'other'], 'Please select a valid application type')
    .required('Application type is required'),

  subject: yup
    .string()
    .required('Subject is required')
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject cannot exceed 200 characters'),

  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message cannot exceed 5000 characters'),

  attachment: yup.string().optional(),

  status: yup
    .mixed<'pending' | 'approved' | 'rejected' | 'cancelled'>()
    .oneOf(['pending', 'approved', 'rejected', 'cancelled'], 'Please select a valid status')
    .optional(),

  organization: yup.string().uuid('Organization must be a valid UUID').optional(),
  organization_name: yup.string().optional(),
  created_at: yup.string().optional(),
  updated_at: yup.string().optional(),
  reviewed_by: yup.string().uuid('Reviewer must be a valid UUID').optional(),
  reviewed_by_name: yup.string().optional(),
  reviewed_at: yup.string().optional(),
  response_message: yup.string().optional(),
});

// Schema for creating a new application (more strict validations)
export const createApplicationSchema = applicationSchema.shape({
  //   applicant: yup.string().required('Applicant is required').uuid('Applicant must be a valid UUID'),
  application_type: yup
    .mixed<'leave' | 'request' | 'other'>()
    .oneOf(['leave', 'request', 'other'], 'Please select a valid application type')
    .required('Application type is required'),
  subject: yup.string().required('Subject is required').min(3).max(200),
  message: yup.string().required('Message is required').min(10).max(5000),
});

// Schema for updating an application (all fields optional except what you want to enforce)
export const updateApplicationSchema = yup.object({
  subject: yup.string().min(3).max(200).optional(),
  message: yup.string().min(10).max(5000).optional(),
  application_type: yup
    .mixed<'leave' | 'request' | 'other'>()
    .oneOf(['leave', 'request', 'other'], 'Please select a valid application type')
    .optional(),
  attachment: yup.string().optional(),
  status: yup
    .mixed<'pending' | 'approved' | 'rejected' | 'cancelled'>()
    .oneOf(['pending', 'approved', 'rejected', 'cancelled'], 'Please select a valid status')
    .optional(),
  reviewed_by: yup.string().uuid('Reviewer must be a valid UUID').optional(),
  reviewed_at: yup.string().optional(),
  response_message: yup.string().optional(),
});

// Schema for reviewing an application (admin actions)
export const reviewApplicationSchema = yup.object({
  status: yup
    .mixed<'approved' | 'rejected' | 'cancelled'>()
    .oneOf(['approved', 'rejected', 'cancelled'], 'Please select a valid status')
    .required('Status is required for review'),
  response_message: yup
    .string()
    .required('Response message is required')
    .min(10, 'Response message must be at least 10 characters')
    .max(1000, 'Response message cannot exceed 1000 characters'),
});
