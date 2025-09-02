import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { classSchema } from '../models/class.schema';
import type { ClassModel } from '../models/model';

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

          {/* Status */}
          <div className="d-flex align-items-center justify-content-between">
            <div className="status-title">
              <h5>Status</h5>
              <p>Change the Status by toggle</p>
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
