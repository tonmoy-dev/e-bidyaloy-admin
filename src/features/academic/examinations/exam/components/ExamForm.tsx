import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useSessions } from '../../../sessions/hooks/useSessions';
import { useClasses } from '../../../classes/hooks/useClasses';
import { useSubjects } from '../../../class-subject/hooks/useGetSubjectsQuery';
import { useGetTeachersQuery } from '../../../../peoples/teacher/api/teacherApi';
import type { ExamModel, CreateExamRequest } from '../models/exam.model';
import { examSchema } from '../models/exam.schema';
import { useExamTypes } from '../../exam-type/hooks/useExamTypes';

interface ExamFormProps {
  defaultValues?: ExamModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: CreateExamRequest) => Promise<void> | void;
  onActiveModal: (modalType: null) => void;
}

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ExamForm({ mode, defaultValues, onSubmit }: ExamFormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateExamRequest>({
    resolver: yupResolver(examSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      start_date: defaultValues?.start_date ?? '',
      end_date: defaultValues?.end_date ?? '',
      result_publish_date: defaultValues?.result_publish_date ?? '',
      status: defaultValues?.status ?? 'scheduled',
      instructions: defaultValues?.instructions ?? '',
      academic_year: defaultValues?.academic_year ?? '',
      exam_type: defaultValues?.exam_type ?? '',
      class_obj: defaultValues?.class_obj ?? '',
      section: defaultValues?.section ?? '',
      exam_subjects: defaultValues?.exam_subjects ?? [
        {
          subject: '',
          exam_date: '',
          start_time: '',
          duration_minutes: 0,
          max_marks: '',
          passing_marks: '',
          room_number: '',
          supervisor: '',
          instructions: '',
          status: 'scheduled',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exam_subjects',
  });

  // Fetch data for dropdowns
  const { sessions } = useSessions();
  const { classes } = useClasses();
  const { subjects } = useSubjects();
  const { examTypes } = useExamTypes();
  const { data: teachersData } = useGetTeachersQuery();

  return (
    <form id="exam-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row g-3">
        {/* Basic Information */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <h6 className="mb-3">Basic Information</h6>
            <div className="row">
              {/* Exam Name */}
              <div className="col-md-6">
                <label className="form-label">Exam Name <span className="text-danger">*</span></label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      {...field}
                      placeholder="Enter exam name"
                    />
                  )}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              {/* Status */}
              <div className="col-md-6">
                <label className="form-label">Status <span className="text-danger">*</span></label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                      {...field}
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
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
                      placeholder="Enter exam description"
                      rows={3}
                    />
                  )}
                />
                {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
              </div>

              {/* Instructions */}
              <div className="col-md-12">
                <label className="form-label">Instructions</label>
                <Controller
                  name="instructions"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      className="form-control"
                      {...field}
                      placeholder="Enter exam instructions"
                      rows={2}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Date Information */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <h6 className="mb-3">Date Information</h6>
            <div className="row">
              {/* Start Date */}
              <div className="col-md-4">
                <label className="form-label">Start Date <span className="text-danger">*</span></label>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                      {...field}
                    />
                  )}
                />
                {errors.start_date && <div className="invalid-feedback">{errors.start_date.message}</div>}
              </div>

              {/* End Date */}
              <div className="col-md-4">
                <label className="form-label">End Date <span className="text-danger">*</span></label>
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      className={`form-control ${errors.end_date ? 'is-invalid' : ''}`}
                      {...field}
                    />
                  )}
                />
                {errors.end_date && <div className="invalid-feedback">{errors.end_date.message}</div>}
              </div>

              {/* Result Publish Date */}
              <div className="col-md-4">
                <label className="form-label">Result Publish Date <span className="text-danger">*</span></label>
                <Controller
                  name="result_publish_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      className={`form-control ${errors.result_publish_date ? 'is-invalid' : ''}`}
                      {...field}
                    />
                  )}
                />
                {errors.result_publish_date && <div className="invalid-feedback">{errors.result_publish_date.message}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <h6 className="mb-3">Academic Information</h6>
            <div className="row">
              {/* Academic Year */}
              <div className="col-md-6">
                <label className="form-label">Academic Year (Session) <span className="text-danger">*</span></label>
                <Controller
                  name="academic_year"
                  control={control}
                  render={({ field }) => (
                    <select
                      className={`form-select ${errors.academic_year ? 'is-invalid' : ''}`}
                      {...field}
                    >
                      <option value="">Select Academic Year</option>
                      {sessions?.results?.map((session) => (
                        <option key={session.id} value={session.id}>
                          {session.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.academic_year && <div className="invalid-feedback">{errors.academic_year.message}</div>}
              </div>

              {/* Exam Type */}
              <div className="col-md-6">
                <label className="form-label">Exam Type <span className="text-danger">*</span></label>
                <Controller
                  name="exam_type"
                  control={control}
                  render={({ field }) => (
                    <select
                      className={`form-select ${errors.exam_type ? 'is-invalid' : ''}`}
                      {...field}
                    >
                      <option value="">Select Exam Type</option>
                      {examTypes?.results?.map((examType) => (
                        <option key={examType.id} value={examType.id}>
                          {examType.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.exam_type && <div className="invalid-feedback">{errors.exam_type.message}</div>}
              </div>

              {/* Class */}
              <div className="col-md-6">
                <label className="form-label">Class <span className="text-danger">*</span></label>
                <Controller
                  name="class_obj"
                  control={control}
                  render={({ field }) => (
                    <select
                      className={`form-select ${errors.class_obj ? 'is-invalid' : ''}`}
                      {...field}
                    >
                      <option value="">Select Class</option>
                      {classes?.results?.map((classItem) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.class_obj && <div className="invalid-feedback">{errors.class_obj.message}</div>}
              </div>

              {/* Section */}
              <div className="col-md-6">
                <label className="form-label">Section</label>
                <Controller
                  name="section"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="form-control"
                      {...field}
                      placeholder="Enter section (optional)"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Exam Subjects */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Exam Subjects</h6>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  append({
                    subject: '',
                    exam_date: '',
                    start_time: '',
                    duration_minutes: 0,
                    max_marks: '',
                    passing_marks: '',
                    room_number: '',
                    supervisor: '',
                    instructions: '',
                    status: 'scheduled',
                  })
                }
              >
                Add Subject
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border rounded p-3 mb-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Subject {index + 1}</h6>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="row">
                  {/* Subject */}
                  <div className="col-md-6">
                    <label className="form-label">Subject <span className="text-danger">*</span></label>
                    <Controller
                      name={`exam_subjects.${index}.subject`}
                      control={control}
                      render={({ field }) => (
                        <select
                          className={`form-select ${errors.exam_subjects?.[index]?.subject ? 'is-invalid' : ''}`}
                          {...field}
                        >
                          <option value="">Select Subject</option>
                          {subjects?.results?.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.name} ({subject.code})
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.exam_subjects?.[index]?.subject && (
                      <div className="invalid-feedback">{errors.exam_subjects[index]?.subject?.message}</div>
                    )}
                  </div>

                  {/* Exam Date */}
                  <div className="col-md-6">
                    <label className="form-label">Exam Date <span className="text-danger">*</span></label>
                    <Controller
                      name={`exam_subjects.${index}.exam_date`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="date"
                          className={`form-control ${errors.exam_subjects?.[index]?.exam_date ? 'is-invalid' : ''}`}
                          {...field}
                        />
                      )}
                    />
                    {errors.exam_subjects?.[index]?.exam_date && (
                      <div className="invalid-feedback">{errors.exam_subjects[index]?.exam_date?.message}</div>
                    )}
                  </div>

                  {/* Start Time */}
                  <div className="col-md-4">
                    <label className="form-label">Start Time <span className="text-danger">*</span></label>
                    <Controller
                      name={`exam_subjects.${index}.start_time`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="time"
                          className={`form-control ${errors.exam_subjects?.[index]?.start_time ? 'is-invalid' : ''}`}
                          {...field}
                        />
                      )}
                    />
                    {errors.exam_subjects?.[index]?.start_time && (
                      <div className="invalid-feedback">{errors.exam_subjects[index]?.start_time?.message}</div>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="col-md-4">
                    <label className="form-label">Duration (minutes) <span className="text-danger">*</span></label>
                    <Controller
                      name={`exam_subjects.${index}.duration_minutes`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="number"
                          className={`form-control ${errors.exam_subjects?.[index]?.duration_minutes ? 'is-invalid' : ''}`}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          placeholder="Enter duration in minutes"
                          min="1"
                        />
                      )}
                    />
                    {errors.exam_subjects?.[index]?.duration_minutes && (
                      <div className="invalid-feedback">{errors.exam_subjects[index]?.duration_minutes?.message}</div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-md-4">
                    <label className="form-label">Status <span className="text-danger">*</span></label>
                    <Controller
                      name={`exam_subjects.${index}.status`}
                      control={control}
                      render={({ field }) => (
                        <select
                          className={`form-select ${errors.exam_subjects?.[index]?.status ? 'is-invalid' : ''}`}
                          {...field}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.exam_subjects?.[index]?.status && (
                      <div className="invalid-feedback">{errors.exam_subjects[index]?.status?.message}</div>
                    )}
                  </div>

                  {/* Max Marks */}
                  <div className="col-md-6">
                    <label className="form-label">Max Marks <span className="text-danger">*</span></label>
                    <Controller
                      name={`exam_subjects.${index}.max_marks`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="text"
                          className={`form-control ${errors.exam_subjects?.[index]?.max_marks ? 'is-invalid' : ''}`}
                          {...field}
                          placeholder="Enter maximum marks"
                        />
                      )}
                    />
                    {errors.exam_subjects?.[index]?.max_marks && (
                      <div className="invalid-feedback">{errors.exam_subjects[index]?.max_marks?.message}</div>
                    )}
                  </div>

                  {/* Passing Marks */}
                  <div className="col-md-6">
                    <label className="form-label">Passing Marks <span className="text-danger">*</span></label>
                    <Controller
                      name={`exam_subjects.${index}.passing_marks`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="text"
                          className={`form-control ${errors.exam_subjects?.[index]?.passing_marks ? 'is-invalid' : ''}`}
                          {...field}
                          placeholder="Enter passing marks"
                        />
                      )}
                    />
                    {errors.exam_subjects?.[index]?.passing_marks && (
                      <div className="invalid-feedback">{errors.exam_subjects[index]?.passing_marks?.message}</div>
                    )}
                  </div>

                  {/* Room Number */}
                  <div className="col-md-6">
                    <label className="form-label">Room Number</label>
                    <Controller
                      name={`exam_subjects.${index}.room_number`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="text"
                          className="form-control"
                          {...field}
                          placeholder="Enter room number (optional)"
                        />
                      )}
                    />
                  </div>

                  {/* Supervisor */}
                  <div className="col-md-6">
                    <label className="form-label">Supervisor</label>
                    <Controller
                      name={`exam_subjects.${index}.supervisor`}
                      control={control}
                      render={({ field }) => (
                        <select
                          className="form-select"
                          {...field}
                        >
                          <option value="">Select Supervisor</option>
                          {teachersData?.results?.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.first_name} {teacher.last_name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>

                  {/* Instructions */}
                  <div className="col-md-12">
                    <label className="form-label">Subject Instructions</label>
                    <Controller
                      name={`exam_subjects.${index}.instructions`}
                      control={control}
                      render={({ field }) => (
                        <textarea
                          className="form-control"
                          {...field}
                          placeholder="Enter subject-specific instructions (optional)"
                          rows={2}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-12">
          {/* Submit */}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'} Exam
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}