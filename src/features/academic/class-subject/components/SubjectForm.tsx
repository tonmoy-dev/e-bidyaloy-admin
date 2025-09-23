import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import SelectDropDown from '../../../../shared/components/utils/SelectDropDown';
import type { SubjectModel } from '../models/subject.model';
import { subjectSchema } from './subjectSchema';

interface SubjectFormProps {
  defaultValues?: SubjectModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: SubjectModel) => Promise<void> | void;
  onActiveModal: (modalType: null) => void;
}

export default function SubjectForm({ mode, defaultValues, onSubmit }: SubjectFormProps) {
  // Subject type options (you may want to move this to a constants file)
  const subjectTypeOptions = [
    { label: 'CORE', value: 'CORE' },
    { label: 'ELECTIVE', value: 'ELECTIVE' },
    { label: 'PRACTICAL', value: 'PRACTICAL' },
    { label: 'THEORY', value: 'THEORY' },
    { label: 'LAB', value: 'LAB' },
    { label: 'EXTRACURRICULAR', value: 'EXTRACURRICULAR' },
  ];

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SubjectModel>({
    resolver: yupResolver(subjectSchema),
    defaultValues: {
      id: defaultValues?.id ?? '',
      name: defaultValues?.name ?? '',
      code: defaultValues?.code ?? '',
      description: defaultValues?.description ?? '',
      subject_type: defaultValues?.subject_type ?? 'core',
      is_active: defaultValues?.is_active ?? true,
    },
  });

  return (
    <form id="subject-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <div className="row">
              {/* Subject Name */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Subject Name *</label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Enter subject name"
                        {...field}
                      />
                    )}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>
              </div>

              {/* Subject Code */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Subject Code *</label>
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                        placeholder="Enter subject code"
                        {...field}
                      />
                    )}
                  />
                  {errors.code && <div className="invalid-feedback">{errors.code.message}</div>}
                </div>
              </div>

              {/* Subject Type */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Subject Type</label>
                  <Controller
                    name="subject_type"
                    control={control}
                    render={({ field }) => (
                      <SelectDropDown
                        value={
                          subjectTypeOptions.find((option) => option.value === field.value) ??
                          subjectTypeOptions[0]
                        }
                        options={subjectTypeOptions}
                        onChange={(option) => field.onChange(option?.value || 'core')}
                      />
                    )}
                  />
                  {errors.subject_type && (
                    <div className="invalid-feedback d-block">{errors.subject_type.message}</div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="col-md-6">
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-start gap-3">
                    <div className="status-title">
                      <h5>Status</h5>
                      <p className="mb-0">Change the status by toggle</p>
                    </div>
                    <div className="form-check form-switch">
                      <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="checkbox"
                            className="form-check-input"
                            role="switch"
                            id="switch-sm"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        )}
                      />
                    </div>
                  </div>
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
                        placeholder="Enter subject description (optional)"
                        {...field}
                      />
                    )}
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description.message}</div>
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
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Add'} Subject
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
