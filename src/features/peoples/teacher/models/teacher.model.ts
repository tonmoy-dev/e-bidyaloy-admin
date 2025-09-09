export interface TeacherModel {
  id?: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  gender: string;
  address: string;
  profile_picture_url?: string;
  department: string;
  designation: string;
  hire_date: string;
  employment_type: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  qualifications: string;
  experience_years: number;
  termination_date?: string;
  termination_reason?: string;
  is_active: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
