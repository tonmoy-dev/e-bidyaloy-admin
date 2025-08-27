// User and Auth related types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  role: string | null;
  thana: string | null;
  city: string | null;
  country: string | null;
  created_by: string | null;
  updated_by: string | null;
  last_login: string | null;
  gender: string;
  primary_phone: string | null;
  secondary_phone: string | null;
  date_of_birth: string | null;
  street_address_one: string | null;
  postal_code: string | null;
  image: string | null;
  nid: string | null;
  created_at: string;
  updated_at: string;
  email_otp: string | null;
  is_email_verified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginAttempt: number | null;
  isRefreshing: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  access: string;
  user: User;
}

// Registration related types
export interface RegistrationFormData {
  // Basic Registration
  schoolName: string;
  ieenNumber: string;
  schoolWebsite: string;
  phoneNumber: string;

  // Institutional Info
  address: string;
  principalName: string;
  totalTeachers: number | string;
  totalStudents: number | string;
  classes: string;
  totalSections: number | string;

  // System Features
  hasBiometricSystem: boolean;
  hasUniqueIds: boolean;
  hasExistingWebsite: boolean;

  // Authentication
  officialEmail: string;
  password: string;
  confirmPassword: string;

  // Terms agreement
  agreeToTerms: boolean;
}

export interface RegistrationData {
  username: string;
  password: string;
  password_confirm: string;
  school_name?: string;
  ieen_number?: string;
  school_website?: string;
  phone_number?: string;
  address?: string;
  principal_name?: string;
  total_teachers?: number;
  total_students?: number;
  classes?: string;
  total_sections?: number;
  has_biometric_system?: boolean;
  has_unique_ids?: boolean;
  has_existing_website?: boolean;
}

export interface RegistrationResponse {
  access: string;
  refresh: string;
  user: User;
  message?: string;
}

export interface VerificationData {
  token?: string;
  code?: string;
  email?: string;
}

export interface ApiError {
  data?: {
    detail?: string;
    username?: string[];
    password?: string[];
    password_confirm?: string[];
    [key: string]: any;
  };
  message?: string;
  status?: number;
}
