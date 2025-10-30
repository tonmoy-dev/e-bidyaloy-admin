// models/notice.model.ts
export type UUID = string;
export type AudienceType = 'global' | 'teachers' | 'students';

export interface NoticeModel {
  id?: UUID;
  title: string;
  description: string;
  audience: AudienceType;
  is_published?: boolean;
  expiry_date?: string; // ISO datetime string (YYYY-MM-DD HH:mm:ss)
  attachment?: string; // filename or URL
  publish_date?: string; // ISO datetime string (YYYY-MM-DD HH:mm:ss)
  organization?: UUID;
  organization_name?: string;
  created_at?: string; // ISO datetime
  updated_at?: string; // ISO datetime
  created_by?: UUID;
  created_by_name?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type NoticePaginatedResponse = PaginatedResponse<NoticeModel>;

// Audience choices for dropdowns - matching backend
export const AUDIENCE_CHOICES: Array<{ value: AudienceType; label: string }> = [
  { value: 'global', label: 'Global (All Users)' },
  { value: 'teachers', label: 'Teachers Only' },
  { value: 'students', label: 'Students Only' },
];
