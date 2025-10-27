import { useState } from 'react';
import { 
  useUploadAssignmentAttachmentMutation,
  useDeleteAssignmentAttachmentMutation 
} from '../api/assignmentAttachmentApi';
import type { UploadedFile, FileUploadState } from '../models/attachment.model';

export const useAttachmentUpload = () => {
  const [uploadStates, setUploadStates] = useState<Map<string, FileUploadState>>(new Map());
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const [uploadAttachment] = useUploadAssignmentAttachmentMutation();
  const [deleteAttachment] = useDeleteAssignmentAttachmentMutation();

  // Create FormData for file upload
  const createFormData = (file: File): FormData => {
    const formData = new FormData();
    formData.append('attachment_type', 'assignment');
    formData.append('file_name', file.name);
    formData.append('file', file);
    formData.append('file_size', file.size.toString());
    return formData;
  };

  // Generate file preview URL
  const generatePreview = (file: File): string | null => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  // Upload a single file
  const uploadFile = async (file: File): Promise<string | null> => {
    const fileId = `${file.name}-${Date.now()}`;
    
    try {
      // Update upload state
      setUploadStates(prev => new Map(prev.set(fileId, {
        file,
        preview: generatePreview(file),
        uploading: true,
        progress: 0,
        error: null,
      })));

      // Create form data for file upload
      const formData = createFormData(file);
      
      // Update progress
      setUploadStates(prev => {
        const current = prev.get(fileId);
        if (current) {
          return new Map(prev.set(fileId, { ...current, progress: 50 }));
        }
        return prev;
      });

      // Upload to API
      const response = await uploadAttachment(formData).unwrap();

      // Update progress to complete
      setUploadStates(prev => {
        const current = prev.get(fileId);
        if (current) {
          return new Map(prev.set(fileId, { 
            ...current, 
            uploading: false, 
            progress: 100,
            error: null,
          }));
        }
        return prev;
      });

      // Add to uploaded files
      const uploadedFile: UploadedFile = {
        id: fileId,
        file,
        fileName: file.name,
        fileSize: file.size,
        preview: generatePreview(file),
        attachmentData: response,
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
      
      return response.id;
    } catch (error) {
      console.error('Upload failed:', error);
      
      // Update error state
      setUploadStates(prev => {
        const current = prev.get(fileId);
        if (current) {
          return new Map(prev.set(fileId, { 
            ...current, 
            uploading: false, 
            error: error instanceof Error ? error.message : 'Upload failed',
          }));
        }
        return prev;
      });
      
      return null;
    }
  };

  // Upload multiple files
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadFile(file));
    const results = await Promise.allSettled(uploadPromises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<string> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  };

  // Remove uploaded file
  const removeUploadedFile = async (fileId: string): Promise<boolean> => {
    try {
      const uploadedFile = uploadedFiles.find(f => f.id === fileId);
      
      if (uploadedFile?.attachmentData?.id) {
        await deleteAttachment(uploadedFile.attachmentData.id).unwrap();
      }

      // Remove from state
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      setUploadStates(prev => {
        const newMap = new Map(prev);
        newMap.delete(fileId);
        return newMap;
      });

      return true;
    } catch (error) {
      console.error('Failed to remove file:', error);
      return false;
    }
  };

  // Clear all uploads
  const clearUploads = () => {
    // Cleanup preview URLs
    uploadedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    setUploadedFiles([]);
    setUploadStates(new Map());
  };

  // Get all uploaded attachment IDs
  const getUploadedAttachmentIds = (): string[] => {
    return uploadedFiles
      .map(file => file.attachmentData?.id)
      .filter((id): id is string => Boolean(id));
  };

  // Get all uploaded attachments data
  const getUploadedAttachments = () => {
    return uploadedFiles
      .map(file => file.attachmentData)
      .filter(attachment => Boolean(attachment));
  };

  return {
    uploadStates: Object.fromEntries(uploadStates),
    uploadedFiles,
    uploadFile,
    uploadFiles,
    removeUploadedFile,
    clearUploads,
    getUploadedAttachmentIds,
    getUploadedAttachments,
  };
};