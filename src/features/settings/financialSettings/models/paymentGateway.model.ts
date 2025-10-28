// models/paymentGateway.model.ts

export type UUID = string;

export type GatewayType = 'sslcommerz' | 'bkash' | 'stripe';
export type CurrencyType = 'BDT' | 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

export interface PaymentGatewayModel {
  id?: UUID;
  gateway_name: GatewayType;
  store_id: string;
  store_password: string;
  sandbox_mode: boolean;
  currency: CurrencyType;
  callback_url: string;
  cancel_url: string;
  organization?: UUID;
  organization_name?: string;
  is_active?: boolean;
  created_at?: string; // ISO datetime
  updated_at?: string; // ISO datetime
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type PaymentGatewayPaginatedResponse = PaginatedResponse<PaymentGatewayModel>;

// Gateway choices for dropdowns
export const GATEWAY_CHOICES: Array<{ value: GatewayType; label: string }> = [
  { value: 'sslcommerz', label: 'SSLCommerz' },
  { value: 'bkash', label: 'bKash' },
  { value: 'stripe', label: 'Stripe' },
];

// Currency choices for dropdowns
export const CURRENCY_CHOICES: Array<{ value: CurrencyType; label: string }> = [
  { value: 'BDT', label: 'Bangladeshi Taka' },
  { value: 'USD', label: 'US Dollar' },
  { value: 'EUR', label: 'Euro' },
  { value: 'GBP', label: 'British Pound' },
  { value: 'INR', label: 'Indian Rupee' },
  { value: 'CAD', label: 'Canadian Dollar' },
  { value: 'AUD', label: 'Australian Dollar' },
];
