export interface AssignmentAttachment {
  id?: string;
  attachment_type: 'assignment';
  file_name: string;
  file: string; // base64 encoded file or file path
  file_url?: string;
  file_size: number;
  created_at?: string;
}

export interface AttachmentFormData {
  attachment_type: 'assignment';
  file_name: string;
  file: string;
  file_url?: string;
  file_size: number;
}

export interface AttachmentUploadResponse {
  id: string;
  attachment_type: 'assignment';
  file_name: string;
  file: string;
  file_url: string;
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