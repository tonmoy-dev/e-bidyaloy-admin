// components/ApplicationForm.tsx

import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { ApplicationModel } from '../models/application.model';
import { applicationSchema } from '../models/application.schema';

interface ApplicationFormProps {
  defaultValues?: ApplicationModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: FormData) => Promise<void> | void;
  onActiveModal?: (modalType: null) => void;
}

const APPLICATION_TYPE_CHOICES = [
  { value: 'leave', label: 'Leave Application' },
  { value: 'transfer', label: 'Transfer Application' },
  { value: 'certificate', label: 'Certificate Request' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'other', label: 'Other' },
];

export default function ApplicationForm({
  mode = 'add',
  defaultValues,
  onSubmit,
}: ApplicationFormProps) {
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
    defaultValues?.attachment ?? null,
  );

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Omit<ApplicationModel, 'id'>>({
    resolver: yupResolver(applicationSchema),
    defaultValues: {
      application_type: defaultValues?.application_type ?? 'leave',
      subject: defaultValues?.subject ?? '',
      message: defaultValues?.message ?? '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentFile(file);

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachmentPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const handleFormSubmit = async (data: Omit<ApplicationModel, 'id'>) => {
    const formData = new FormData();

    // Append all text fields
    formData.append('application_type', data.application_type);
    formData.append('subject', data.subject);
    formData.append('message', data.message);

    // Append file if selected
    if (attachmentFile) {
      formData.append('attachment', attachmentFile);
    }

    await onSubmit(formData);
  };

  const removeAttachment = () => {
    setAttachmentFile(null);
    setAttachmentPreview(null);
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'ti-file-type-pdf';
      case 'doc':
      case 'docx':
        return 'ti-file-type-doc';
      case 'xls':
      case 'xlsx':
        return 'ti-file-type-xls';
      default:
        return 'ti-file';
    }
  };

  return (
    <form id="application-form" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="row g-3">
        {/* Basic Information */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <h6 className="mb-3">Application Information</h6>
            <div className="row">
              {/* Application Type */}
              <div className="col-md-6">
                <label className="form-label">
                  Application Type <span className="text-danger">*</span>
                </label>
                <Controller
                  name="application_type"
                  control={control}
                  render={({ field }) => (
                    <select
                      className={`form-select ${errors.application_type ? 'is-invalid' : ''}`}
                      {...field}
                    >
                      <option value="">Select Type</option>
                      {APPLICATION_TYPE_CHOICES.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.application_type && (
                  <div className="invalid-feedback">{errors.application_type.message}</div>
                )}
              </div>

              {/* Subject */}
              <div className="col-md-6">
                <label className="form-label">
                  Subject <span className="text-danger">*</span>
                </label>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                      {...field}
                      placeholder="Enter application subject"
                    />
                  )}
                />
                {errors.subject && <div className="invalid-feedback">{errors.subject.message}</div>}
              </div>

              {/* Message */}
              <div className="col-md-12">
                <label className="form-label">
                  Message <span className="text-danger">*</span>
                </label>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                      {...field}
                      placeholder="Enter your message"
                      rows={5}
                    />
                  )}
                />
                {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Attachment */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <h6 className="mb-3">Attachment (Optional)</h6>
            <div className="row">
              <div className="col-md-12">
                <label className="form-label">Upload File</label>
                <div className="bg-light p-3 pb-2 rounded">
                  <div className="mb-3">
                    <p>Upload size of 10MB, Accepted Format: Images, PDF, DOC, XLS</p>
                  </div>
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                      <i className="ti ti-file-upload me-1" />
                      Upload
                      <input
                        type="file"
                        className="form-control image_sign"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Attachment Preview */}
                {(attachmentPreview || defaultValues?.attachment) && (
                  <div className="mt-3">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            {attachmentPreview &&
                            (attachmentFile?.type.startsWith('image/') ||
                              defaultValues?.attachment?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ? (
                              <img
                                src={attachmentPreview}
                                alt="Preview"
                                className="rounded me-3"
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="me-3">
                                <i
                                  className={`${getFileIcon(
                                    attachmentFile?.name ?? defaultValues?.attachment ?? '',
                                  )} fs-1`}
                                />
                              </div>
                            )}
                            <div>
                              <p className="mb-0 fw-semibold">
                                {attachmentFile?.name ??
                                  defaultValues?.attachment ??
                                  'Attached File'}
                              </p>
                              {attachmentFile && (
                                <small className="text-muted">
                                  {(attachmentFile.size / 1024 / 1024).toFixed(2)} MB
                                </small>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={removeAttachment}
                          >
                            <i className="ti ti-trash" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-md-12">
          <div className="mt-3">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting
                ? 'Submitting...'
                : mode === 'edit'
                ? 'Update Application'
                : 'Submit Application'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
