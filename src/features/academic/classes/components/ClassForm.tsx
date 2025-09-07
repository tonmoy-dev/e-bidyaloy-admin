import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import SelectDropDown from '../../../../shared/components/utils/SelectDropDown';
import { useSessions } from '../../sessions/hooks/useSessions';
import type { ClassModel } from '../models/class.model';
import { classSchema } from '../models/class.schema';

interface ClassFormProps {
  defaultValues?: ClassModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: ClassModel) => Promise<void> | void;
  onActiveModal: (modalType: null) => void;
}

export default function ClassForm({ defaultValues, mode, onSubmit }: ClassFormProps) {
  const { sessions } = useSessions(1);
  const academicYears = sessions?.results;
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ClassModel>({
    resolver: yupResolver(classSchema),
    defaultValues: {
      is_active: defaultValues?.is_active ?? true,
      academic_year: defaultValues?.academic_year ?? '',
      name: defaultValues?.name ?? '',
    },
  });

  const yearOptions =
    academicYears?.map((session) => ({
      label: session.name,
      value: String(session.id),
    })) || [];

  return (
    <form id="class-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-12">
          {/* Class Name */}
          <div className="mb-3">
            <label className="form-label">Class Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  {...field}
                />
              )}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          {/* Academic Year */}
          <div className="mb-3">
            <label className="form-label">Academic Year</label>
            <Controller
              name="academic_year"
              control={control}
              render={({ field }) => (
                <SelectDropDown
                  value={yearOptions.find((o) => o.value === field.value) ?? null}
                  options={yearOptions}
                  onChange={(option) => field.onChange(option?.value || '')}
                />
              )}
            />
            {errors.academic_year && (
              <div className="invalid-feedback d-block">{errors.academic_year.message}</div>
            )}
          </div>

          {/* Status */}
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
                  />
                )}
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
