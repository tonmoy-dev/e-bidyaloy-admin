import React, { useCallback, useState } from 'react';
import { useAttachmentUpload } from '../hooks/useAttachmentUpload';
import type { UploadedFile } from '../models/attachment.model';

interface FileUploadComponentProps {
  onFilesUploaded?: (attachmentIds: string[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  disabled?: boolean;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  onFilesUploaded,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif'],
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const {
    uploadStates,
    uploadedFiles,
    uploadFiles,
    removeUploadedFile,
    getUploadedAttachmentIds,
  } = useAttachmentUpload();

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Validate files
  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
    const errors: string[] = [];
    const valid: File[] = [];

    // Format file size helper
    const formatSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Check total files limit
    if (uploadedFiles.length + files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed. You can upload ${maxFiles - uploadedFiles.length} more files.`);
      return { valid, errors };
    }

    files.forEach(file => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large. Maximum size is ${formatSize(maxFileSize)}.`);
        return;
      }

      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedFileTypes.includes(fileExtension)) {
        errors.push(`${file.name} file type not supported. Allowed types: ${acceptedFileTypes.join(', ')}`);
        return;
      }

      // Check for duplicates
      if (uploadedFiles.some(uploaded => uploaded.fileName === file.name && uploaded.fileSize === file.size)) {
        errors.push(`${file.name} is already uploaded.`);
        return;
      }

      valid.push(file);
    });

    return { valid, errors };
  }, [uploadedFiles, maxFiles, maxFileSize, acceptedFileTypes]);

  // Handle file selection/drop
  const handleFiles = useCallback(async (files: File[]) => {
    const { valid, errors } = validateFiles(files);

    if (errors.length > 0) {
      alert('Upload errors:\n' + errors.join('\n'));
      return;
    }

    if (valid.length > 0) {
      await uploadFiles(valid);
      if (onFilesUploaded) {
        onFilesUploaded(getUploadedAttachmentIds());
      }
    }
  }, [validateFiles, uploadFiles, onFilesUploaded, getUploadedAttachmentIds]);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [disabled, handleFiles]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
      e.target.value = ''; // Reset input
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

  // Get file icon based on extension
  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'fas fa-file-pdf text-danger';
      case 'doc':
      case 'docx': return 'fas fa-file-word text-primary';
      case 'txt': return 'fas fa-file-alt text-secondary';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'fas fa-file-image text-success';
      default: return 'fas fa-file text-secondary';
    }
  };

  // Remove file handler
  const handleRemoveFile = async (fileId: string) => {
    const success = await removeUploadedFile(fileId);
    if (success && onFilesUploaded) {
      onFilesUploaded(getUploadedAttachmentIds());
    }
  };

  return (
    <>
      <style>{`
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
          transform: scale(1.02);
        }
        
        .file-upload-zone:hover:not(.disabled) {
          border-color: #007bff;
          background: #f0f8ff;
        }
        
        .file-upload-zone.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #e9ecef;
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
          transition: all 0.2s ease;
        }
        
        .file-item:hover {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .file-progress {
          width: 100%;
          height: 0.25rem;
          background-color: #e9ecef;
          border-radius: 0.125rem;
          overflow: hidden;
        }
        
        .file-progress-bar {
          height: 100%;
          background-color: #007bff;
          transition: width 0.3s ease;
        }
        
        .file-preview-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 0.25rem;
        }
        
        .upload-info {
          font-size: 0.875rem;
          color: #6c757d;
          margin-top: 0.5rem;
        }
        
        .file-icon-large {
          font-size: 2rem;
        }
        
        .hidden-input {
          display: none;
        }
        
        .progress-bar-width {
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

        /* Mobile responsiveness for file upload */
        @media (max-width: 768px) {
          .file-upload-zone {
            padding: 1.5rem 1rem !important;
            margin-bottom: 1rem !important;
          }
          
          .upload-icon {
            margin-bottom: 1rem !important;
          }
          
          .upload-icon i {
            font-size: 2rem !important;
          }
          
          .file-upload-zone h5 {
            font-size: 1rem !important;
            margin-bottom: 0.75rem !important;
          }
          
          .file-upload-zone p {
            font-size: 0.85rem !important;
          }
          
          .file-item {
            padding: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .file-info {
            font-size: 0.85rem !important;
          }
          
          .file-name {
            font-size: 0.9rem !important;
          }
          
          .file-size {
            font-size: 0.8rem !important;
          }
          
          .file-preview-image {
            width: 40px !important;
            height: 40px !important;
          }
          
          .file-icon-large {
            font-size: 1.5rem !important;
          }
          
          .btn-sm {
            padding: 0.25rem 0.5rem !important;
            font-size: 0.8rem !important;
          }
          
          .uploaded-files h6 {
            font-size: 0.9rem !important;
          }
        }

        @media (max-width: 576px) {
          .file-upload-zone {
            padding: 1rem 0.75rem !important;
          }
          
          .file-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }
          
          .file-icon {
            align-self: center !important;
          }
          
          .file-actions {
            align-self: flex-end !important;
            width: 100% !important;
            display: flex !important;
            justify-content: flex-end !important;
          }
          
          .form-text small {
            font-size: 0.8rem !important;
          }
        }
      `}</style>

      <div className="file-upload-container">
        {/* Upload Zone */}
        <div
          className={`file-upload-zone ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && document.getElementById('file-input')?.click()}
        >
          <div className="upload-icon mb-3">
            <i className="fas fa-cloud-upload-alt fa-3x text-primary"></i>
          </div>
          <h5 className="mb-2">Drop files here or click to browse</h5>
          <p className="text-muted mb-0">
            Supported formats: {acceptedFileTypes.join(', ')}
          </p>
          <p className="upload-info">
            Maximum file size: {formatFileSize(maxFileSize)} | Maximum files: {maxFiles}
          </p>
          
          <input
            id="file-input"
            type="file"
            multiple
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden-input"
            disabled={disabled}
            aria-label="File upload input"
            title="Select files to upload"
          />
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files mt-3">
            <h6 className="mb-3">
              <i className="fas fa-paperclip me-2"></i>
              Uploaded Files ({uploadedFiles.length}/{maxFiles})
            </h6>
            
            {uploadedFiles.map((uploadedFile: UploadedFile) => {
              const uploadState = uploadStates[uploadedFile.id];
              
              return (
                <div key={uploadedFile.id} className="file-item">
                  {/* File Icon/Preview */}
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
                  
                  {/* File Info */}
                  <div className="file-info flex-grow-1">
                    <div className="file-name fw-medium">{uploadedFile.fileName}</div>
                    <div className="file-size text-muted small">
                      {formatFileSize(uploadedFile.fileSize)}
                    </div>
                    
                    {/* Progress Bar */}
                    {uploadState?.uploading && (
                      <div className="file-progress mt-1">
                        <div 
                          className={`file-progress-bar progress-${Math.round(uploadState.progress / 10) * 10}`}
                        ></div>
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {uploadState?.error && (
                      <div className="text-danger small mt-1">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        {uploadState.error}
                      </div>
                    )}
                  </div>
                  
                  {/* Status & Actions */}
                  <div className="file-actions">
                    {uploadState?.uploading ? (
                      <div className="text-primary">
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Uploading...
                      </div>
                    ) : uploadState?.error ? (
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveFile(uploadedFile.id)}
                          title="Remove failed upload"
                          aria-label="Remove failed upload"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                    ) : (
                      <>
                        <span className="text-success me-2">
                          <i className="fas fa-check-circle"></i>
                        </span>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleRemoveFile(uploadedFile.id)}
                          title="Remove file"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default FileUploadComponent;