// schemas/paymentGateway.schema.ts

import * as yup from 'yup';
import type { PaymentGatewayModel } from './paymentGateway.model';

export const paymentGatewaySchema: yup.ObjectSchema<Omit<PaymentGatewayModel, 'id'>> = yup.object({
  gateway_name: yup
    .mixed<'sslcommerz' | 'bkash' | 'stripe'>()
    .oneOf(['sslcommerz', 'bkash', 'stripe'])
    .required('Gateway Name is required'),

  store_id: yup.string().required('Store ID is required').min(1, 'Store ID cannot be empty'),

  store_password: yup
    .string()
    .required('Store Password is required')
    .min(1, 'Store Password cannot be empty'),

  sandbox_mode: yup.boolean().required('Sandbox Mode is required'),

  currency: yup
    .mixed<'BDT' | 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD'>()
    .oneOf(['BDT', 'USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
    .required('Currency is required'),

  callback_url: yup
    .string()
    .url('Callback URL must be a valid URL')
    .required('Callback URL is required'),

  cancel_url: yup.string().url('Cancel URL must be a valid URL').required('Cancel URL is required'),

  organization: yup.string().optional(),

  organization_name: yup.string().optional(),

  is_active: yup.boolean().optional(),

  created_at: yup.string().optional(),

  updated_at: yup.string().optional(),
});
