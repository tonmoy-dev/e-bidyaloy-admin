import * as yup from 'yup';

export const complaintSchema = yup.object().shape({
  complaint_type: yup.string().required('Complaint type is required'),
  subject: yup
    .string()
    .required('Subject is required')
    .min(3, 'Subject must be at least 3 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  priority: yup.string().oneOf(['low', 'medium', 'high', 'urgent']).optional(),
  attachment: yup.mixed().optional(),
});
