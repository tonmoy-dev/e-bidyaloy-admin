import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import SelectDropDown from '../../../../shared/components/utils/SelectDropDown';
import { useGetTeachersQuery } from '../api/teacherApi';
import type { ClassModel } from '../models/class.model';
import { classSchema } from '../models/class.schema';

interface ClassFormProps {
  defaultValues?: ClassModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: ClassModel) => Promise<void> | void;
  onActiveModal: (modalType: null) => void;
}

export default function ClassForm({ defaultValues, mode, onSubmit }: ClassFormProps) {
  const { data } = useGetTeachersQuery(1);

  const teachers = data?.results;
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ClassModel>({
    resolver: yupResolver(classSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      class_teacher_id: defaultValues?.class_teacher_id ?? '',
      is_active: defaultValues?.is_active ?? true,
      sections: [{ name: '', section_teacher_id: '', is_active: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections',
  });

  const teacherOptions =
    teachers?.map((teacher) => ({
      label: teacher.user?.username,
      value: String(teacher.id),
    })) || [];

  return (
    <form id="class-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row g-3">
        <div className="col-md-12">
          <h4 className="mb-2">Class</h4>
          <div className="border rounded p-3 mb-3">
            <div className="row align-items-center ">
              {/* Class Name */}
              <div className="col-md-4">
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
              {/* Class Teacher */}
              <div className="col-md-4">
                <label className="form-label">Class Teacher</label>
                <Controller
                  name="class_teacher"
                  control={control}
                  render={({ field }) => (
                    <SelectDropDown
                      value={teacherOptions.find((o) => o.value === String(field.value)) ?? null}
                      options={teacherOptions}
                      onChange={(option) => field.onChange(option?.value || '')}
                    />
                  )}
                />
                {errors.class_teacher && (
                  <div className="invalid-feedback d-block">{errors.class_teacher.message}</div>
                )}
              </div>
              {/* Status */}
              <div className="col-md-4">
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
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <h4 className="mb-2 d-flex align-items-center gap-2">
            Sections
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={() => append({ name: '', section_teacher_id: '', is_active: true })}
            >
              + Add More Section
            </button>
          </h4>

          {fields.map((section, index) => (
            <div key={section.id} className="border rounded p-3 mb-3">
              <div className="row align-items-center">
                {/* Section Name */}
                <div className="col-md-4">
                  <label className="form-label">Section Name</label>
                  <Controller
                    name={`sections.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className={`form-control ${
                          errors.sections?.[index]?.name ? 'is-invalid' : ''
                        }`}
                        {...field}
                      />
                    )}
                  />
                  {errors.sections?.[index]?.name && (
                    <div className="invalid-feedback">{errors.sections[index].name.message}</div>
                  )}
                </div>
                {/* Section Teacher */}
                <div className="col-md-4">
                  <label className="form-label">Section Teacher</label>
                  <Controller
                    name={`sections.${index}.section_teacher_id`}
                    control={control}
                    render={({ field }) => (
                      <SelectDropDown
                        value={teacherOptions.find((o) => o.value === field.value) ?? null}
                        options={teacherOptions}
                        onChange={(option) => field.onChange(option?.value || '')}
                      />
                    )}
                  />
                </div>
                {/* Section Status + Remove */}
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="status-title">
                        <h5>Status</h5>
                      </div>
                      <div className="form-check form-switch">
                        <Controller
                          name={`sections.${index}.is_active`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              className="form-check-input"
                              role="switch"
                              id="switch-sm2"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-12">
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
