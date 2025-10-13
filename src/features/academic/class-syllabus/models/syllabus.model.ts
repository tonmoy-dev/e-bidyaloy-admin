export interface SyllabusModel {
  id: string;
  title: string;
  description: string;
  content: string;
  file_url: string | null;
  pdf_file: string | null; // backend might send this as a URL or null
  status: 'draft' | 'published' | 'archived' | string; // flexible for extra statuses
  subject: string; // UUID of the subject
  classes: string; // UUID of the class
  created_at?: string;
  updated_at?: string;
}
