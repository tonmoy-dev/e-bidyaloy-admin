import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import SelectDropDown from '../../../../shared/components/utils/SelectDropDown';
import { useClassesWithoutPagination } from '../../classes/hooks/useClassWP';
import { useSubjectsWithoutPagination } from '../hooks/useSubjectsWP';
import type { SyllabusModel } from '../models/syllabus.model';
import { SyllabusStatusEnum, syllabusSchema } from './syllabusSchema';

interface SyllabusFormProps {
  defaultValues?: SyllabusModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: SyllabusModel) => Promise<void> | void;
  onActiveModal: (modalType: null) => void;
}

export default function SyllabusForm({ mode, defaultValues, onSubmit }: SyllabusFormProps) {
  const { classes, isLoading: classesLoading } = useClassesWithoutPagination();
  const { subjects, isLoading: subjectsLoading } = useSubjectsWithoutPagination();

  const statusOptions = [
    { label: 'Draft', value: SyllabusStatusEnum.DRAFT },
    { label: 'Published', value: SyllabusStatusEnum.PUBLISHED },
    { label: 'Archived', value: SyllabusStatusEnum.ARCHIVED },
  ];

  // Transform classes data for dropdown
  const classOptions =
    classes?.map((classItem) => ({
      label: classItem.name,
      value: classItem.id,
    })) || [];

  // Transform subjects data for dropdown
  const subjectOptions =
    subjects?.map((subject) => ({
      label: subject.name,
      value: subject.id,
    })) || [];

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SyllabusModel>({
    resolver: yupResolver(syllabusSchema),
    defaultValues: {
      id: defaultValues?.id ?? '',
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      content: defaultValues?.content ?? '',
      file_url: defaultValues?.file_url ?? '',
      pdf_file: defaultValues?.pdf_file ?? null,
      status: defaultValues?.status ?? SyllabusStatusEnum.DRAFT,
      subject: defaultValues?.subject ?? '',
      classes: defaultValues?.classes ?? '',
    },
  });

  // Reset form when defaultValues change (important for edit mode)
  useEffect(() => {
    if (defaultValues) {
      reset({
        id: defaultValues.id ?? '',
        title: defaultValues.title ?? '',
        description: defaultValues.description ?? '',
        content: defaultValues.content ?? '',
        file_url: defaultValues.file_url ?? '',
        pdf_file: defaultValues.pdf_file ?? null,
        status: defaultValues.status ?? SyllabusStatusEnum.DRAFT,
        subject: defaultValues.subject ?? '',
        classes: defaultValues.classes ?? '',
      });
    }
  }, [defaultValues, reset]);

  return (
    <form id="syllabus-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <div className="row">
              {/* Title */}
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Title *</label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        placeholder="Enter syllabus title"
                        {...field}
                      />
                    )}
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                </div>
              </div>

              {/* Class Dropdown */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Class *</label>
                  <Controller
                    name="classes"
                    control={control}
                    render={({ field }) => {
                      const selectedOption =
                        classOptions.find((option) => option.value === field.value) || null;

                      return (
                        <SelectDropDown
                          value={selectedOption}
                          options={classOptions}
                          onChange={(option) => field.onChange(option?.value || '')}
                          placeholder={classesLoading ? 'Loading classes...' : 'Select a class'}
                          isDisabled={classesLoading}
                        />
                      );
                    }}
                  />
                  {errors.classes && (
                    <div className="invalid-feedback d-block">{errors.classes.message}</div>
                  )}
                </div>
              </div>

              {/* Subject Dropdown */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Subject *</label>
                  <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => {
                      const selectedOption =
                        subjectOptions.find((option) => option.value === field.value) || null;

                      return (
                        <SelectDropDown
                          value={selectedOption}
                          options={subjectOptions}
                          onChange={(option) => field.onChange(option?.value || '')}
                          placeholder={subjectsLoading ? 'Loading subjects...' : 'Select a subject'}
                          isDisabled={subjectsLoading}
                        />
                      );
                    }}
                  />
                  {errors.subject && (
                    <div className="invalid-feedback d-block">{errors.subject.message}</div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Status *</label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <SelectDropDown
                        value={
                          statusOptions.find((option) => option.value === field.value) ??
                          statusOptions[0]
                        }
                        options={statusOptions}
                        onChange={(option) =>
                          field.onChange(option?.value || SyllabusStatusEnum.DRAFT)
                        }
                      />
                    )}
                  />
                  {errors.status && (
                    <div className="invalid-feedback d-block">{errors.status.message}</div>
                  )}
                </div>
              </div>

              {/* File URL */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">File URL</label>
                  <Controller
                    name="file_url"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="url"
                        className={`form-control ${errors.file_url ? 'is-invalid' : ''}`}
                        placeholder="Enter file URL (optional)"
                        {...field}
                        value={field.value || ''}
                      />
                    )}
                  />
                  {errors.file_url && (
                    <div className="invalid-feedback">{errors.file_url.message}</div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        rows={3}
                        placeholder="Enter syllabus description (optional)"
                        {...field}
                      />
                    )}
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description.message}</div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                        rows={5}
                        placeholder="Enter detailed syllabus content (optional)"
                        {...field}
                      />
                    )}
                  />
                  {errors.content && (
                    <div className="invalid-feedback">{errors.content.message}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          {/* Submit */}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Add'} Syllabus
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
