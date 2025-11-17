import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../../core/store';
import { useUploadAssignmentAttachmentMutation } from '../api/assignmentAttachmentApi';
import { useCreateSubmissionMutation } from '../api/submissionApi';
import type { CreateSubmissionRequest, SubmissionAttachment } from '../models/submission.model';

interface SubmissionFormProps {
  assignmentId: string;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

interface UploadedFile {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  preview?: string;
  attachmentData?: SubmissionAttachment;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({
  assignmentId,
  onSubmitSuccess,
  onCancel,
}) => {
  const [submissionText, setSubmissionText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createSubmission] = useCreateSubmissionMutation();
  const [uploadAttachment] = useUploadAssignmentAttachmentMutation();
  const { user } = useAppSelector((state) => state.auth);

  // Derive student id from auth user object. Prefer explicit student fields if present.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _authUser: any = user;
  // Prefer profile_id returned by login, fall back to other possible shapes
  const studentIdFromAuth: string | undefined =
    _authUser?.profile_id ||
    _authUser?.student_id ||
    _authUser?.profile?.id ||
    _authUser?.student?.id ||
    _authUser?.student_profile?.id ||
    _authUser?.id;

  // Helpful debug during development; remove if verbose in production
  console.log('Derived student ID from auth (preferred profile_id):', studentIdFromAuth);

  // Handle combined submission - Create submission and upload files
  const handleSubmitAssignment = async () => {
    if (!submissionText.trim()) {
      toast.error('Please enter submission message');
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    try {
      setIsSubmitting(true);

      const studentId = studentIdFromAuth;

      if (!studentId) {
        toast.error('Student ID not found in auth state. Please login again as student.');
        return;
      }

      const submissionData: CreateSubmissionRequest = {
        assignment: assignmentId,
        student: studentId,
        submission_text: submissionText,
        submitted_at: new Date().toISOString(),
        status: 'submitted',
      };

      const response = await createSubmission(submissionData).unwrap();
      const submissionId = response.id;

      // Upload all files to the created submission
      // NOTE: Backend serializer must include 'attachments' field for attachments to appear in GET response.
      // Django: Add to AssignmentSubmissionSerializer: attachments = SubmissionAttachmentSerializer(many=True, read_only=True)
      for (const uploadedFile of uploadedFiles) {
        if (!uploadedFile.attachmentData) {
          const formData = new FormData();
          formData.append('assignment', assignmentId);
          formData.append('submission', submissionId);
          formData.append('attachment_type', 'submission');
          formData.append('file_name', uploadedFile.fileName);
          formData.append('file', uploadedFile.file);
          formData.append('file_size', uploadedFile.fileSize.toString());

          await uploadAttachment(formData).unwrap();
        }
      }

      toast.success('Assignment submitted successfully!');
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Failed to submit assignment:', error);
      toast.error('Failed to submit assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file selection (not upload yet, just add to list)
  const addFileToList = useCallback((file: File): void => {
    const fileId = `${file.name}-${file.size}-${Date.now()}`;

    // Create preview for images
    let preview: string | undefined;
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }

    setUploadedFiles((prev) => [
      ...prev,
      {
        id: fileId,
        file,
        fileName: file.name,
        fileSize: file.size,
        preview,
      },
    ]);
  }, []);

  // Validate files
  const validateFiles = useCallback(
    (files: File[]): { valid: File[]; errors: string[] } => {
      const errors: string[] = [];
      const valid: File[] = [];
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      const maxFiles = 5;
      const acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif'];

      const formatSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      if (uploadedFiles.length + files.length > maxFiles) {
        errors.push(
          `Maximum ${maxFiles} files allowed. You can upload ${
            maxFiles - uploadedFiles.length
          } more files.`,
        );
        return { valid, errors };
      }

      files.forEach((file) => {
        if (file.size > maxFileSize) {
          errors.push(`${file.name} is too large. Maximum size is ${formatSize(maxFileSize)}.`);
          return;
        }

        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!acceptedTypes.includes(fileExtension)) {
          errors.push(
            `${file.name} file type not supported. Allowed types: ${acceptedTypes.join(', ')}`,
          );
          return;
        }

        if (
          uploadedFiles.some(
            (uploaded) => uploaded.fileName === file.name && uploaded.fileSize === file.size,
          )
        ) {
          errors.push(`${file.name} is already uploaded.`);
          return;
        }

        valid.push(file);
      });

      return { valid, errors };
    },
    [uploadedFiles],
  );

  // Handle files
  const handleFiles = useCallback(
    (files: File[]) => {
      const { valid, errors } = validateFiles(files);

      if (errors.length > 0) {
        alert('Upload errors:\n' + errors.join('\n'));
        return;
      }

      if (valid.length > 0) {
        for (const file of valid) {
          addFileToList(file);
        }
      }
    },
    [validateFiles, addFileToList],
  );

  // Drag handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles],
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
      e.target.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-primary';
      case 'txt':
        return 'fas fa-file-alt text-secondary';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'fas fa-file-image text-success';
      default:
        return 'fas fa-file text-secondary';
    }
  };

  // Remove uploaded file
  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <>
      <style>{`
        .submission-step {
          padding: 1.5rem;
        }
        
        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
        .step-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          background: #e9ecef;
          color: #6c757d;
        }
        
        .step-circle.active {
          background: #007bff;
          color: white;
        }
        
        .step-circle.completed {
          background: #28a745;
          color: white;
        }
        
        .step-line {
          width: 60px;
          height: 2px;
          background: #e9ecef;
          margin: 0 1rem;
        }
        
        .step-line.completed {
          background: #28a745;
        }
        
        .file-upload-zone {
          border: 2px dashed #d1ecf1;
          border-radius: 0.375rem;
          padding: 2rem;
          text-align: center;
          background: #f8f9fa;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .file-upload-zone.drag-active {
          border-color: #007bff;
          background: #e7f3ff;
        }
        
        .file-upload-zone:hover {
          border-color: #007bff;
          background: #f0f8ff;
        }
        
        .file-item {
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: #fff;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .file-icon-large {
          font-size: 2rem;
        }
        
        .hidden-input {
          display: none;
        }
        
        .file-preview-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .progress-thin {
          height: 4px;
        }
        
        .progress-bar[data-progress] {
          transition: width 0.3s ease;
        }
        
        .progress-0 { width: 0%; }
        .progress-10 { width: 10%; }
        .progress-20 { width: 20%; }
        .progress-30 { width: 30%; }
        .progress-40 { width: 40%; }
        .progress-50 { width: 50%; }
        .progress-60 { width: 60%; }
        .progress-70 { width: 70%; }
        .progress-80 { width: 80%; }
        .progress-90 { width: 90%; }
        .progress-100 { width: 100%; }
      `}</style>

      <div className="submission-form">
        {/* Combined Form */}
        <div className="submission-step">
          <h5 className="mb-3">Submit Your Assignment</h5>

          {/* Submission Message */}
          <div className="mb-4">
            <label className="form-label">
              Submission Message <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Enter your submission message, notes, or comments..."
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
            />
          </div>

          {/* File Upload Section */}
          <div className="mb-4">
            <label className="form-label">
              Upload Files <span className="text-danger">*</span>
            </label>
            <div>
              (
              <div
                className={`file-upload-zone ${dragActive ? 'drag-active' : ''} mb-3`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('submission-file-input')?.click()}
              >
                <div className="upload-icon mb-2">
                  <i className="fas fa-cloud-upload-alt fa-2x text-primary"></i>
                </div>
                <p className="mb-1">Drop files here or click to browse</p>
                <p className="text-muted small mb-0">
                  PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF | Max 10MB | Max 5 files
                </p>

                <input
                  id="submission-file-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileInputChange}
                  className="hidden-input"
                  aria-label="Upload submission files"
                  title="Upload files"
                />
              </div>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files mb-3">
              <h6 className="mb-3">
                <i className="fas fa-paperclip me-2"></i>
                Uploaded Files ({uploadedFiles.length}/5)
              </h6>

              {uploadedFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="file-item">
                  <div className="file-icon">
                    {uploadedFile.preview ? (
                      <img
                        src={uploadedFile.preview}
                        alt={uploadedFile.fileName}
                        className="file-preview-image"
                      />
                    ) : (
                      <i className={`${getFileIcon(uploadedFile.fileName)} file-icon-large`}></i>
                    )}
                  </div>

                  <div className="file-info flex-grow-1">
                    <div className="file-name fw-medium">{uploadedFile.fileName}</div>
                    <div className="file-size text-muted small">
                      {formatFileSize(uploadedFile.fileSize)}
                    </div>
                  </div>

                  <div className="file-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFile(uploadedFile.id)}
                      title="Remove file"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="d-flex gap-2 justify-content-end">
            {onCancel && (
              <button type="button" className="btn btn-light" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSubmitAssignment}
              disabled={isSubmitting || !submissionText.trim() || uploadedFiles.length === 0}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Submit Assignment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmissionForm;
