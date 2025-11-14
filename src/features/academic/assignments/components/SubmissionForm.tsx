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

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
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
  const [step, setStep] = useState<1 | 2>(1);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createSubmission] = useCreateSubmissionMutation();
  const [uploadAttachment] = useUploadAssignmentAttachmentMutation();
  const { user } = useAppSelector((state) => state.auth);

  // Derive student id from auth user object. Prefer explicit student fields if present.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _authUser: any = user;
  const studentIdFromAuth: string | undefined =
    _authUser?.student_id ||
    _authUser?.student?.id ||
    _authUser?.profile?.id ||
    _authUser?.student_profile?.id ||
    _authUser?.id;

    console.log('Derived student ID from auth:', studentIdFromAuth);

  // Handle first step - Create submission
  const handleCreateSubmission = async () => {
    if (!submissionText.trim()) {
      toast.error('Please enter submission message');
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
      setSubmissionId(response.id);
      setStep(2);
      toast.success('Submission created successfully. Now you can upload files.');
    } catch (error) {
      console.error('Failed to create submission:', error);
      toast.error('Failed to create submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file upload
  const uploadFile = useCallback(
    async (file: File): Promise<SubmissionAttachment | null> => {
      if (!submissionId) {
        toast.error('Submission ID not available');
        return null;
      }

      const fileId = `${file.name}-${file.size}-${Date.now()}`;

      setUploadStates((prev) => ({
        ...prev,
        [fileId]: { uploading: true, progress: 50, error: null },
      }));

      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      try {
        const formData = new FormData();
        formData.append('assignment', assignmentId);
        formData.append('submission', submissionId);
        formData.append('attachment_type', 'submission');
        formData.append('file_name', file.name);
        formData.append('file', file);
        formData.append('file_size', file.size.toString());

        const response = await uploadAttachment(formData).unwrap();

        // Add to uploaded files
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: fileId,
            file,
            fileName: file.name,
            fileSize: file.size,
            preview,
            attachmentData: response as unknown as SubmissionAttachment,
          },
        ]);

        setUploadStates((prev) => ({
          ...prev,
          [fileId]: { uploading: false, progress: 100, error: null },
        }));

        toast.success(`${file.name} uploaded successfully`);
        return response as unknown as SubmissionAttachment;
      } catch (error) {
        console.error('Upload error:', error);
        const errorMessage = 'Failed to upload file';

        setUploadStates((prev) => ({
          ...prev,
          [fileId]: { uploading: false, progress: 0, error: errorMessage },
        }));

        toast.error(`Failed to upload ${file.name}`);
        return null;
      }
    },
    [assignmentId, submissionId, uploadAttachment],
  );

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
    async (files: File[]) => {
      const { valid, errors } = validateFiles(files);

      if (errors.length > 0) {
        alert('Upload errors:\n' + errors.join('\n'));
        return;
      }

      if (valid.length > 0) {
        for (const file of valid) {
          await uploadFile(file);
        }
      }
    },
    [validateFiles, uploadFile],
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

  // Final submit
  const handleFinalSubmit = () => {
    toast.success('Assignment submitted successfully!');
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
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
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="step-item">
            <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
            <span>Submission Message</span>
          </div>
          <div className={`step-line ${step >= 2 ? 'completed' : ''}`} />
          <div className="step-item">
            <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
            <span>Upload Files</span>
          </div>
        </div>

        {/* Step 1: Submission Message */}
        {step === 1 && (
          <div className="submission-step">
            <h5 className="mb-3">Enter Your Submission Message</h5>
            <div className="mb-3">
              <label className="form-label">
                Submission Message <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Enter your submission message, notes, or comments..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2 justify-content-end">
              {onCancel && (
                <button type="button" className="btn btn-light" onClick={onCancel}>
                  Cancel
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateSubmission}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Creating...
                  </>
                ) : (
                  'Next: Upload Files'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: File Upload */}
        {step === 2 && (
          <div className="submission-step">
            <h5 className="mb-3">Upload Your Submission Files</h5>

            {/* Upload Zone */}
            <div
              className={`file-upload-zone ${dragActive ? 'drag-active' : ''} mb-3`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('submission-file-input')?.click()}
            >
              <div className="upload-icon mb-3">
                <i className="fas fa-cloud-upload-alt fa-3x text-primary"></i>
              </div>
              <h5 className="mb-2">Drop files here or click to browse</h5>
              <p className="text-muted mb-0">
                Supported formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF
              </p>
              <p className="text-muted small">Maximum file size: 10MB | Maximum files: 5</p>

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

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="uploaded-files mb-3">
                <h6 className="mb-3">
                  <i className="fas fa-paperclip me-2"></i>
                  Uploaded Files ({uploadedFiles.length}/5)
                </h6>

                {uploadedFiles.map((uploadedFile) => {
                  const uploadState = uploadStates[uploadedFile.id];

                  return (
                    <div key={uploadedFile.id} className="file-item">
                      <div className="file-icon">
                        {uploadedFile.preview ? (
                          <img
                            src={uploadedFile.preview}
                            alt={uploadedFile.fileName}
                            className="file-preview-image"
                          />
                        ) : (
                          <i
                            className={`${getFileIcon(uploadedFile.fileName)} file-icon-large`}
                          ></i>
                        )}
                      </div>

                      <div className="file-info flex-grow-1">
                        <div className="file-name fw-medium">{uploadedFile.fileName}</div>
                        <div className="file-size text-muted small">
                          {formatFileSize(uploadedFile.fileSize)}
                        </div>

                        {uploadState?.uploading && (
                          <div className="progress progress-thin mt-1">
                            <div
                              className={`progress-bar progress-${
                                Math.round(uploadState.progress / 10) * 10
                              }`}
                              role="progressbar"
                              aria-label="Upload progress"
                            ></div>
                          </div>
                        )}

                        {uploadState?.error && (
                          <div className="text-danger small mt-1">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            {uploadState.error}
                          </div>
                        )}
                      </div>

                      <div className="file-actions">
                        {uploadState?.uploading ? (
                          <div className="text-primary">
                            <i className="fas fa-spinner fa-spin"></i>
                          </div>
                        ) : (
                          <span className="text-success">
                            <i className="fas fa-check-circle"></i>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  if (uploadedFiles.length === 0) {
                    setStep(1);
                  } else {
                    if (confirm('Are you sure you want to go back? Uploaded files will remain.')) {
                      setStep(1);
                    }
                  }
                }}
              >
                Back
              </button>
              <button type="button" className="btn btn-success" onClick={handleFinalSubmit}>
                <i className="fas fa-check me-2"></i>
                Submit Assignment
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SubmissionForm;
