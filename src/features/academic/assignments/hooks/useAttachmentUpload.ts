import { useCallback, useEffect, useState } from 'react';
import {
  useDeleteAssignmentAttachmentMutation,
  useUploadAssignmentAttachmentMutation,
} from '../api/assignmentAttachmentApi';
import type { FileUploadState, UploadedFile } from '../models/attachment.model';

interface UseAttachmentUploadProps {
  assignmentId?: string;
}

export const useAttachmentUpload = (props?: UseAttachmentUploadProps) => {
  const { assignmentId } = props || {};
  const [uploadStates, setUploadStates] = useState<Map<string, FileUploadState>>(new Map());
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]); // Files waiting for assignment ID

  const [uploadAttachment] = useUploadAssignmentAttachmentMutation();
  const [deleteAttachment] = useDeleteAssignmentAttachmentMutation();

  // Create FormData for file upload
  const createFormData = useCallback(
    (file: File): FormData => {
      const formData = new FormData();
      formData.append('attachment_type', 'assignment');
      formData.append('file_name', file.name);
      formData.append('file', file);
      formData.append('file_size', file.size.toString());

      // Add assignment ID if provided
      if (assignmentId) {
        formData.append('assignment', assignmentId);
      }

      return formData;
    },
    [assignmentId],
  );

  // Generate file preview URL
  const generatePreview = (file: File): string | null => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  // Upload a single file
  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      const fileId = `${file.name}-${Date.now()}`;

      try {
        // Update upload state
        setUploadStates(
          (prev) =>
            new Map(
              prev.set(fileId, {
                file,
                preview: generatePreview(file),
                uploading: true,
                progress: 0,
                error: null,
              }),
            ),
        );

        // Create form data for file upload
        const formData = createFormData(file);

        // Update progress
        setUploadStates((prev) => {
          const current = prev.get(fileId);
          if (current) {
            return new Map(prev.set(fileId, { ...current, progress: 50 }));
          }
          return prev;
        });

        // Upload to API
        const response = await uploadAttachment(formData).unwrap();

        console.log('File uploaded successfully:', response);

        // Update progress to complete
        setUploadStates((prev) => {
          const current = prev.get(fileId);
          if (current) {
            return new Map(
              prev.set(fileId, {
                ...current,
                uploading: false,
                progress: 100,
                error: null,
              }),
            );
          }
          return prev;
        });

        // Add to uploaded files
        const uploadedFile: UploadedFile = {
          id: fileId,
          file,
          fileName: file.name,
          fileSize: file.size,
          preview: generatePreview(file) || undefined,
          attachmentData: response,
        };

        setUploadedFiles((prev) => [...prev, uploadedFile]);

        console.log('Uploaded file added to state:', uploadedFile);
        console.log('All uploaded files:', uploadedFiles);

        return response.id;
      } catch (error) {
        console.error('Upload failed:', error);

        // Update error state
        setUploadStates((prev) => {
          const current = prev.get(fileId);
          if (current) {
            return new Map(
              prev.set(fileId, {
                ...current,
                uploading: false,
                error: error instanceof Error ? error.message : 'Upload failed',
              }),
            );
          }
          return prev;
        });

        return null;
      }
    },
    [createFormData, uploadAttachment, uploadedFiles],
  );

  // Upload multiple files
  const uploadFiles = useCallback(
    async (files: File[]): Promise<string[]> => {
      const uploadPromises = files.map((file) => uploadFile(file));
      const results = await Promise.allSettled(uploadPromises);

      return results
        .filter(
          (result): result is PromiseFulfilledResult<string> =>
            result.status === 'fulfilled' && result.value !== null,
        )
        .map((result) => result.value);
    },
    [uploadFile],
  );

  // Upload pending files when assignmentId becomes available
  useEffect(() => {
    if (assignmentId && pendingFiles.length > 0) {
      console.log('Assignment ID available, uploading pending files:', pendingFiles);
      uploadFiles(pendingFiles);
      setPendingFiles([]); // Clear pending files after upload
    }
  }, [assignmentId, pendingFiles, uploadFiles]);

  // Remove uploaded file
  const removeUploadedFile = async (fileId: string): Promise<boolean> => {
    try {
      const uploadedFile = uploadedFiles.find((f) => f.id === fileId);

      if (uploadedFile?.attachmentData?.id) {
        await deleteAttachment(uploadedFile.attachmentData.id).unwrap();
      }

      // Remove from state
      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
      setUploadStates((prev) => {
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
    uploadedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    setUploadedFiles([]);
    setUploadStates(new Map());
  };

  // Get all uploaded attachment IDs
  const getUploadedAttachmentIds = (): string[] => {
    const ids = uploadedFiles
      .map((file) => file.attachmentData?.id)
      .filter((id): id is string => Boolean(id));

    console.log('Getting uploaded attachment IDs:', ids);
    console.log('Current uploaded files:', uploadedFiles);

    return ids;
  };

  // Get all uploaded attachments data
  const getUploadedAttachments = () => {
    return uploadedFiles
      .map((file) => file.attachmentData)
      .filter((attachment) => Boolean(attachment));
  };

  // Add files to pending queue (for when no assignmentId is available yet)
  const addToPending = useCallback((files: File[]) => {
    setPendingFiles((prev) => [...prev, ...files]);
    console.log('Added files to pending queue:', files);
  }, []);

  // Upload files immediately if assignmentId is available, otherwise add to pending
  const uploadOrQueue = useCallback(
    async (files: File[]): Promise<string[]> => {
      if (assignmentId) {
        return await uploadFiles(files);
      } else {
        addToPending(files);
        return []; // Return empty array since files are queued, not uploaded
      }
    },
    [assignmentId, uploadFiles, addToPending],
  );

  return {
    uploadStates: Object.fromEntries(uploadStates),
    uploadedFiles,
    pendingFiles,
    uploadFile,
    uploadFiles,
    uploadOrQueue,
    addToPending,
    removeUploadedFile,
    clearUploads,
    getUploadedAttachmentIds,
    getUploadedAttachments,
  };
};
