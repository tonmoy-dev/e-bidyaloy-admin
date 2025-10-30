export interface AssignmentAttachment {
  id?: string;
  assignment?: string; // Assignment ID
  submission?: string | null; // Submission ID (null for assignment attachments)
  attachment_type: 'assignment';
  file_name: string;
  file: string; // URL to the file
  file_url?: string | null;
  file_size: number;
  created_at?: string;
}

export interface AttachmentFormData {
  assignment?: string;
  submission?: string | null;
  attachment_type: 'assignment';
  file_name: string;
  file: string;
  file_url?: string | null;
  file_size: number;
}

export interface AttachmentUploadResponse {
  id: string;
  assignment?: string;
  submission?: string | null;
  attachment_type: 'assignment';
  file_name: string;
  file: string;
  file_url: string | null;
  file_size: number;
  created_at: string;
}

export interface FileUploadState {
  file: File | null;
  preview: string | null;
  uploading: boolean;
  progress: number;
  error: string | null;
}

export interface UploadedFile {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  preview?: string;
  attachmentData?: AssignmentAttachment;
}
