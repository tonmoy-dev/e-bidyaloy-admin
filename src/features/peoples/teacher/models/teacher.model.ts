export interface UserModel {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  full_name: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  profile_picture_url: string | null;
  user_type: string;
  organization: string;
  organization_name: string;
  email_verified_at: string | null;
  last_login_at: string | null;
  preferences?: Record<string, any>;
  roles?: any[];
  is_active: boolean;
  date_joined: string;
}

export interface TeacherModel {
  id: string;
  employee_id: string | null;
  department: string;
  designation: string;
  hire_date: string;
  employment_type: string;
  salary: number | null;
  salary_currency: string;
  bank_account_number: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  qualifications: string;
  experience_years: number;
  specialization: string;
  teaching_license: string;
  license_expiry_date: string | null;
  max_classes_per_week: number;
  is_active: boolean;
  termination_date: string | null;
  termination_reason: string;
  user: UserModel;
  organization: string;
  organization_name: string;
  age?: number;
  specializations?: any[];
  languages_known?: string[];
  created_at?: string;
  updated_at?: string;
}

// Re-export PaginatedResponse from common.model.ts for backward compatibility
export type { PaginatedResponse } from './common.model';
