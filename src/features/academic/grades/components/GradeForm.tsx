import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import type { GradeModel } from '../models/grade.model';
import { gradeSchema } from './gradeSchema';

interface GradeFormProps {
  defaultValues?: GradeModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: GradeModel) => Promise<void> | void;
  onActiveModal: (modalType: null) => void;
}

export default function GradeForm({ mode, defaultValues, onSubmit }: GradeFormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GradeModel>({
    resolver: yupResolver(gradeSchema),
    defaultValues: {
      id: defaultValues?.id ?? '',
      name: defaultValues?.name ?? '',
      level: defaultValues?.level ?? 1,
      description: defaultValues?.description ?? '',
      is_active: defaultValues?.is_active ?? true,
    },
  });

  return (
    <form id="grade-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row g-3">
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <div className="row">
              {/* Name */}
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Name *</label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Enter grade name (e.g., Grade 8)"
                        {...field}
                      />
                    )}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>
              </div>

              {/* Level */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Level *</label>
                  <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        className={`form-control ${errors.level ? 'is-invalid' : ''}`}
                        placeholder="Enter level (e.g., 8)"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                  {errors.level && <div className="invalid-feedback">{errors.level.message}</div>}
                </div>
              </div>

              {/* Active Status */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Status *</label>
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <select
                        className={`form-select ${errors.is_active ? 'is-invalid' : ''}`}
                        {...field}
                        value={field.value ? 'true' : 'false'}
                        onChange={(e) => field.onChange(e.target.value === 'true')}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    )}
                  />
                  {errors.is_active && (
                    <div className="invalid-feedback">{errors.is_active.message}</div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">Description *</label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        rows={4}
                        placeholder="Enter grade description"
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
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Add'} Grade
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
