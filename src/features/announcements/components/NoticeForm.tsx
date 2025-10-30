// components/NoticeForm.tsx

import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { NoticeModel } from '../models/notice.model';
import { noticeSchema } from '../models/notice.schema';

interface NoticeFormProps {
  defaultValues?: NoticeModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: FormData) => Promise<void> | void;
  onActiveModal?: (modalType: null) => void;
}

const AUDIENCE_CHOICES = [
  { value: 'global', label: 'Global (All Users)' },
  { value: 'teachers', label: 'Teachers Only' },
  { value: 'students', label: 'Students Only' },
];

export default function NoticeForm({ mode = 'add', defaultValues, onSubmit }: NoticeFormProps) {
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
    defaultValues?.attachment ?? null,
  );

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Omit<NoticeModel, 'id'>>({
    resolver: yupResolver(noticeSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      audience: defaultValues?.audience ?? 'global',
      is_published: defaultValues?.is_published ?? false,
      expiry_date: defaultValues?.expiry_date ?? '',
      publish_date: defaultValues?.publish_date ?? '',
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

  const handleFormSubmit = async (data: Omit<NoticeModel, 'id'>) => {
    const formData = new FormData();

    // Append all text fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('audience', data.audience);
    formData.append('is_published', String(data.is_published ?? false));

    if (data.expiry_date) {
      formData.append('expiry_date', data.expiry_date);
    }

    if (data.publish_date) {
      formData.append('publish_date', data.publish_date);
    }

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
    <form id="notice-form" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="row g-3">
        {/* Basic Information */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <h6 className="mb-3">Basic Information</h6>
            <div className="row">
              {/* Title */}
              <div className="col-md-12">
                <label className="form-label">
                  Title <span className="text-danger">*</span>
                </label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      {...field}
                      placeholder="Enter notice title"
                    />
                  )}
                />
                {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
              </div>

              {/* Description */}
              <div className="col-md-12">
                <label className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      {...field}
                      placeholder="Enter notice description"
                      rows={5}
                    />
                  )}
                />
                {errors.description && (
                  <div className="invalid-feedback">{errors.description.message}</div>
                )}
              </div>

              {/* Audience */}
              <div className="col-md-6">
                <label className="form-label">
                  Audience <span className="text-danger">*</span>
                </label>
                <Controller
                  name="audience"
                  control={control}
                  render={({ field }) => (
                    <select
                      className={`form-select ${errors.audience ? 'is-invalid' : ''}`}
                      {...field}
                    >
                      <option value="">Select Audience</option>
                      {AUDIENCE_CHOICES.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.audience && (
                  <div className="invalid-feedback">{errors.audience.message}</div>
                )}
              </div>

              {/* Is Published */}
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <Controller
                  name="is_published"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="form-select"
                      {...field}
                      value={field.value ? 'true' : 'false'}
                      onChange={(e) => field.onChange(e.target.value === 'true')}
                    >
                      <option value="false">Draft</option>
                      <option value="true">Published</option>
                    </select>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Date Settings */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <h6 className="mb-3">Date Settings</h6>
            <div className="row">
              {/* Publish Date with Time */}
              <div className="col-md-6">
                <label className="form-label">Publish Date & Time</label>
                <Controller
                  name="publish_date"
                  control={control}
                  render={({ field }) => (
                    <div className="date-pic">
                      <DatePicker
                        showTime
                        className={`form-control datetimepicker ${
                          errors.publish_date ? 'is-invalid' : ''
                        }`}
                        placeholder="Select Date & Time"
                        format="YYYY-MM-DD HH:mm:ss"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => {
                          field.onChange(date ? date.format('YYYY-MM-DD HH:mm:ss') : '');
                        }}
                      />
                      <span className="cal-icon">
                        <i className="ti ti-calendar" />
                      </span>
                    </div>
                  )}
                />
                {errors.publish_date && (
                  <div className="invalid-feedback d-block">{errors.publish_date.message}</div>
                )}
                <small className="text-muted">
                  Date and time when the notice will be published
                </small>
              </div>

              {/* Expiry Date with Time */}
              <div className="col-md-6">
                <label className="form-label">Expiry Date & Time</label>
                <Controller
                  name="expiry_date"
                  control={control}
                  render={({ field }) => (
                    <div className="date-pic">
                      <DatePicker
                        showTime
                        className={`form-control datetimepicker ${
                          errors.expiry_date ? 'is-invalid' : ''
                        }`}
                        placeholder="Select Date & Time"
                        format="YYYY-MM-DD HH:mm:ss"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => {
                          field.onChange(date ? date.format('YYYY-MM-DD HH:mm:ss') : '');
                        }}
                      />
                      <span className="cal-icon">
                        <i className="ti ti-calendar" />
                      </span>
                    </div>
                  )}
                />
                {errors.expiry_date && (
                  <div className="invalid-feedback d-block">{errors.expiry_date.message}</div>
                )}
                <small className="text-muted">Date and time when the notice will expire</small>
              </div>
            </div>
          </div>
        </div>

        {/* Attachment */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <h6 className="mb-3">Attachment</h6>
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
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Notice' : 'Add New Notice'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
