import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import type { SessionModel } from '../models/session.model';
import { sessionSchema } from '../models/session.schema';

interface SessionFormProps {
  defaultValues?: SessionModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: SessionModel) => Promise<void> | void;
  onActiveModal: (modalType: null) => void;
}

export default function SessionForm({ defaultValues, mode, onSubmit }: SessionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SessionModel>({
    resolver: yupResolver(sessionSchema),
    defaultValues: {
      is_current: defaultValues?.is_current ?? true,
      start_date: defaultValues?.start_date ?? '',
      end_date: defaultValues?.end_date ?? '',
    },
  });

  return (
    <form id="session-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-12">
          {/* Session Name */}
          <div className="mb-3">
            <label className="form-label">Session Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              {...register('name')}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          {/* Start Date */}
          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="text"
              className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
              {...register('start_date')}
            />
            {errors.start_date && (
              <div className="invalid-feedback">{errors.start_date.message}</div>
            )}
          </div>

          {/* End Date */}
          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="text"
              className={`form-control ${errors.end_date ? 'is-invalid' : ''}`}
              {...register('end_date')}
            />
            {errors.end_date && <div className="invalid-feedback">{errors.end_date.message}</div>}
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
                {...register('is_current')}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Add'} Session
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
