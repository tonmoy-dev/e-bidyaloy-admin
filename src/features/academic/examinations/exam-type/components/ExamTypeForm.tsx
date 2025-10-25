import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import type { ExamTypeModel, CreateExamTypeRequest } from '../models/exam-type.model';
import { examTypeSchema } from '../models/exam-type.schema';

interface ExamTypeFormProps {
  defaultValues?: ExamTypeModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: CreateExamTypeRequest) => Promise<void> | void;
  onActiveModal: (modalType: null) => void;
}

export default function ExamTypeForm({ mode, defaultValues, onSubmit }: ExamTypeFormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateExamTypeRequest>({
    resolver: yupResolver(examTypeSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      weightage: defaultValues?.weightage ?? '',
      is_active: defaultValues?.is_active ?? true,
    },
  });

  return (
    <form id="exam-type-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <div className="row align-items-center">
              {/* Exam Type Name */}
              <div className="col-md-6">
                <label className="form-label">Exam Type Name <span className="text-danger">*</span></label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      {...field}
                      placeholder="Enter exam type name"
                    />
                  )}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              {/* Weightage */}
              <div className="col-md-6">
                <label className="form-label">Weightage (%) <span className="text-danger">*</span></label>
                <Controller
                  name="weightage"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      className={`form-control ${errors.weightage ? 'is-invalid' : ''}`}
                      {...field}
                      placeholder="Enter weightage percentage"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  )}
                />
                {errors.weightage && <div className="invalid-feedback">{errors.weightage.message}</div>}
              </div>

              {/* Description */}
              <div className="col-md-12">
                <label className="form-label">Description <span className="text-danger">*</span></label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      {...field}
                      placeholder="Enter exam type description"
                      rows={3}
                    />
                  )}
                />
                {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
              </div>

              {/* Status */}
              <div className="col-md-6">
                <div className="d-flex align-items-center justify-content-start gap-3">
                  <div className="status-title">
                    <h5>Status</h5>
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
                          aria-label="Toggle exam type status"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          {/* Submit */}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Add'} Exam Type
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}