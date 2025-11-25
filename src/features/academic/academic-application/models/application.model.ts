export type UUID = string;
export type ApplicationType = 'leave' | 'request' | 'other'; // Extend as needed

export interface ApplicationModel {
  id?: UUID;
  applicant: UUID;
  application_type: ApplicationType;
  subject: string;
  message: string;
  attachment?: string; // filename or URL
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
  organization?: UUID;
  organization_name?: string;
  created_at?: string; // ISO datetime
  updated_at?: string; // ISO datetime
  reviewed_by?: UUID;
  reviewed_by_name?: string;
  reviewed_at?: string; // ISO datetime
  response_message?: string;
}

// Add this missing type for create requests
export interface CreateApplicationRequest {
  applicant: UUID;
  application_type: ApplicationType;
  subject: string;
  message: string;
  newApplication: string;
  attachment?: string;
  organization?: UUID;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type ApplicationPaginatedResponse = PaginatedResponse<ApplicationModel>;

// Application type choices for dropdowns
export const APPLICATION_TYPE_CHOICES: Array<{ value: ApplicationType; label: string }> = [
  { value: 'leave', label: 'Leave Application' },
  { value: 'request', label: 'General Request' },
  { value: 'other', label: 'Other Application' },
];

// Status choices for dropdowns
export const STATUS_CHOICES: Array<{ value: ApplicationModel['status']; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];
