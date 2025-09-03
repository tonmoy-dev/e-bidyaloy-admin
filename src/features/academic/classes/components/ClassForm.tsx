import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import type { ClassModel } from '../models/class.model';
import { classSchema } from '../models/class.schema';

interface ClassFormProps {
  defaultValues?: ClassModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: ClassModel) => Promise<void> | void;
  onActiveModal: (modalType: null) => void;
}

export default function ClassForm({ defaultValues, mode, onSubmit }: ClassFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClassModel>({
    resolver: yupResolver(classSchema),
    defaultValues: {
      is_active: defaultValues?.is_active ?? true,
      academic_year: defaultValues?.academic_year ?? '',
    },
  });

  return (
    <form id="class-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-12">
          {/* Class Name */}
          <div className="mb-3">
            <label className="form-label">Class Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              {...register('name')}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          {/* Academic Year */}
          <div className="mb-3">
            <label className="form-label">Academic Year</label>
            <input
              type="text"
              className={`form-control ${errors.academic_year ? 'is-invalid' : ''}`}
              {...register('academic_year')}
            />
            {errors.academic_year && (
              <div className="invalid-feedback">{errors.academic_year.message}</div>
            )}
          </div>

          {/* Status */}
          <div className="d-flex align-items-center justify-content-start gap-3">
            <div className="status-title">
              <h5>Status</h5>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="switch-sm"
                {...register('is_active')}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Add'} Class
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
