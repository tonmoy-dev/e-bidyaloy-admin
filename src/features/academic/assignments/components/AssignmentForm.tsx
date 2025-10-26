import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { assignmentSchema } from '../models/assignment.schema';
import type { AssignmentFormData, AssignmentModel } from '../models/assignment.model';
import { useClasses } from '../../classes/hooks/useClasses';
import { useSessions } from '../../sessions/hooks/useSessions';
import { useSubjects } from '../../class-subject/hooks/useGetSubjectsQuery';
import { useGetTeachersQuery } from '../../../peoples/teacher/api/teacherApi';
import { useGetStudentsQuery } from '../../../peoples/students/api/studentApi';
import type { SectionModel } from '../../classes/models/class.model';
import type { StudentModel } from '../../../peoples/students/models/student.model';

interface AssignmentFormProps {
  mode: 'add' | 'edit';
  defaultValues?: AssignmentModel;
  onSubmit: (data: AssignmentFormData) => void;
  onActiveModal: (modal: string | null) => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  mode,
  defaultValues,
  onSubmit,
  onActiveModal,
}) => {
  const [selectedTargetType, setSelectedTargetType] = useState<'class' | 'section' | 'individual'>('class');
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm<AssignmentFormData>({
    resolver: yupResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      target_type: 'class',
      class_assigned: '',
      section: '',
      subject: '',
      total_marks: '',
      assigned_by: '',
      due_date: '',
      status: 'draft',
      academic_year: '',
      student_ids: [],
    },
  });

  const watchedTargetType = watch('target_type');
  const watchedClassId = watch('class_assigned');
  const watchedSectionId = watch('section');

  // API hooks for dropdown data
  const { classes } = useClasses();
  const { sessions } = useSessions();
  const { subjects } = useSubjects();
  const { data: teachersData } = useGetTeachersQuery(1);
  const { data: studentsData } = useGetStudentsQuery(1);

  // Memoized options for dropdowns
  const classOptions = useMemo(() => {
    return classes?.results || [];
  }, [classes]);

  const sectionOptions = useMemo(() => {
    if (!selectedClassId) return [];
    const selectedClass = classOptions.find(cls => cls.id === selectedClassId);
    return selectedClass?.sections || [];
  }, [classOptions, selectedClassId]);

  const subjectOptions = useMemo(() => {
    if (!subjects?.results || !selectedClassId) return [];
    
    // Get the selected class name to filter subjects
    const selectedClass = classOptions.find(cls => cls.id === selectedClassId);
    const selectedClassName = selectedClass?.name;
    
    if (!selectedClassName) return [];
    
    // Filter subjects by the selected class name
    return subjects.results.filter(subject => 
      subject.classes === selectedClassName
    );
  }, [subjects, selectedClassId, classOptions]);

  const sessionOptions = useMemo(() => {
    return sessions?.results || [];
  }, [sessions]);

  const teacherOptions = useMemo(() => {
    return teachersData?.results || [];
  }, [teachersData]);

  const filteredStudentOptions = useMemo(() => {
    if (!studentsData?.results || !selectedClassId) return [];
    
    let filtered = studentsData.results.filter(
      (student: StudentModel) => student.class_assigned === selectedClassId
    );

    // If section is selected, always filter by section for individual target type
    if (selectedTargetType === 'individual' && watchedSectionId) {
      filtered = filtered.filter(
        (student: StudentModel) => student.section === watchedSectionId
      );
    }

    return filtered;
  }, [studentsData, selectedClassId, selectedTargetType, watchedSectionId]);

  useEffect(() => {
    if (watchedTargetType) {
      setSelectedTargetType(watchedTargetType);
    }
  }, [watchedTargetType]);

  useEffect(() => {
    if (watchedClassId) {
      setSelectedClassId(watchedClassId);
      // Reset section, subject and student selection when class changes
      setValue('section', '');
      setValue('subject', '');
      setValue('student_ids', []);
    }
  }, [watchedClassId, setValue]);

  // Reset student selection when section changes
  useEffect(() => {
    if (selectedTargetType === 'individual') {
      setValue('student_ids', []);
    }
  }, [watchedSectionId, selectedTargetType, setValue]);

  useEffect(() => {
    if (mode === 'edit' && defaultValues) {
      reset({
        title: defaultValues.title || '',
        description: defaultValues.description || '',
        instructions: defaultValues.instructions || '',
        target_type: defaultValues.target_type || 'class',
        class_assigned: defaultValues.class_assigned || '',
        section: defaultValues.section || '',
        subject: defaultValues.subject || '',
        total_marks: defaultValues.total_marks || '',
        assigned_by: defaultValues.assigned_by || '',
        due_date: defaultValues.due_date ? new Date(defaultValues.due_date).toISOString().split('T')[0] : '',
        status: defaultValues.status || 'draft',
        academic_year: defaultValues.academic_year || '',
        student_ids: defaultValues.student_ids || [],
      });
      setSelectedTargetType(defaultValues.target_type || 'class');
    }
  }, [mode, defaultValues, reset]);

  useEffect(() => {
    setSelectedTargetType(watchedTargetType);
  }, [watchedTargetType]);

  const handleFormSubmit = (data: AssignmentFormData) => {
    // Convert due_date to ISO format for API
    const formattedData = {
      ...data,
      due_date: new Date(data.due_date).toISOString(),
    };
    onSubmit(formattedData);
  };

  return (
    <>
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animated-field {
          animation: slideInDown 0.4s ease-out;
          animation-fill-mode: both;
        }
        
        .student-list-container {
          max-height: 200px;
          overflow-y: auto;
          transition: all 0.4s ease-in-out;
          border-radius: 0.375rem;
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
          animation-fill-mode: both;
        }
        
        .slide-in {
          animation: slideInLeft 0.3s ease-out;
          animation-fill-mode: both;
        }
        
        .form-check.slide-in {
          transition: all 0.2s ease-in-out;
        }
        
        .form-check.slide-in:hover {
          background-color: rgba(0, 123, 255, 0.1);
          border-radius: 0.25rem;
          padding: 0.25rem;
          margin: 0.1rem 0;
        }
        
        .alert.fade-in {
          border-left: 4px solid;
        }
        
        .alert-info.fade-in {
          border-left-color: #0dcaf0;
        }
        
        .alert-warning.fade-in {
          border-left-color: #ffc107;
        }
        
        .info-icon {
          cursor: help;
          font-size: 0.875rem;
        }
        
        .info-icon:hover {
          color: #0056b3 !important;
        }
        
        .compact-alert {
          padding: 0.5rem 0.75rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
      `}</style>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="row">
        {/* Title */}
        <div className="col-md-12 mb-3">
          <label className="form-label">
            Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            {...register('title')}
            placeholder="Enter assignment title"
          />
          {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
        </div>

        {/* Description */}
        <div className="col-md-12 mb-3">
          <label className="form-label">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            rows={1}
            {...register('description')}
            placeholder="Enter assignment description"
          />
          {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
        </div>

        {/* Instructions */}
        <div className="col-md-12 mb-3">
          <label className="form-label">
            Instructions <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
            rows={1}
            {...register('instructions')}
            placeholder="Enter assignment instructions"
          />
          {errors.instructions && <div className="invalid-feedback">{errors.instructions.message}</div>}
        </div>

        
        {/* Academic Year */}
        <div className="col-md-4 mb-3">
          <label className="form-label">
            Academic Year <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.academic_year ? 'is-invalid' : ''}`}
            {...register('academic_year')}
          >
            <option value="">Select Academic Year</option>
            {sessionOptions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name}
              </option>
            ))}
          </select>
          {errors.academic_year && <div className="invalid-feedback">{errors.academic_year.message}</div>}
        </div>

        {/* Total Marks */}
        <div className="col-md-4 mb-3">
          <label className="form-label">
            Total Marks <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.total_marks ? 'is-invalid' : ''}`}
            {...register('total_marks')}
            placeholder="Enter total marks"
          />
          {errors.total_marks && <div className="invalid-feedback">{errors.total_marks.message}</div>}
        </div>
        {/* Status */}
        <div className="col-md-4 mb-3">
          <label className="form-label">
            Status <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.status ? 'is-invalid' : ''}`}
            {...register('status')}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
          {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
        </div>

        {/* Assigned By */}
        <div className="col-md-6 mb-3">
          <label className="form-label">
            Assigned By (Teacher) <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.assigned_by ? 'is-invalid' : ''}`}
            {...register('assigned_by')}
          >
            <option value="">Select Teacher</option>
            {teacherOptions.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.user?.first_name} {teacher.user?.last_name}
              </option>
            ))}
          </select>
          {errors.assigned_by && <div className="invalid-feedback">{errors.assigned_by.message}</div>}
        </div>

        {/* Due Date */}
        <div className="col-md-6 mb-3">
          <label className="form-label">
            Due Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className={`form-control ${errors.due_date ? 'is-invalid' : ''}`}
            {...register('due_date')}
          />
          {errors.due_date && <div className="invalid-feedback">{errors.due_date.message}</div>}
        </div>

        {/* Target Type */}
        <div className="col-md-6 mb-3">
          <label className="form-label">
            Target Type <span className="text-danger">*</span>
            <i 
              className="fas fa-info-circle text-info ms-2 info-icon" 
              title="Please select Assignment Target type, for which amount of student you want to create assignment. Class: All students in the class, Section: All students in a specific section, Individual: Select specific students."
            ></i>
          </label>
          <select
            className={`form-select ${errors.target_type ? 'is-invalid' : ''}`}
            {...register('target_type')}
          >
            <option value="class">Class</option>
            <option value="section">Section</option>
            <option value="individual">Individual</option>
          </select>
          {errors.target_type && <div className="invalid-feedback">{errors.target_type.message}</div>}
        </div>


        {/* Class */}
        <div className="col-md-6 mb-3">
          <label className="form-label">
            Class <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.class_assigned ? 'is-invalid' : ''}`}
            {...register('class_assigned')}
          >
            <option value="">Select Class</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.class_assigned && <div className="invalid-feedback">{errors.class_assigned.message}</div>}
        </div>

         {/* Subject */}
        <div className="col-md-6 mb-3">
          <label className="form-label">
            Subject <span className="text-danger">*</span>
          </label>
          {!selectedClassId ? (
            <div className="alert alert-warning compact-alert fade-in">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <small>Please select a class first to view available subjects.</small>
            </div>
          ) : (
            <select
              className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
              {...register('subject')}
            >
              <option value="">Select Subject</option>
              {subjectOptions.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          )}
          {errors.subject && <div className="invalid-feedback">{errors.subject.message}</div>}
        </div>

        {/* Section - Only show for section and individual target types */}
        {(selectedTargetType === 'section' || selectedTargetType === 'individual') && (
          <div className="col-md-6 mb-3 animated-field">
            <label className="form-label">
              Section <span className="text-danger">*</span>
            </label>
            {!selectedClassId ? (
              <div className="alert alert-warning compact-alert fade-in">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <small>Please select a class first to view available sections.</small>
              </div>
            ) : sectionOptions.length === 0 ? (
              <div className="alert alert-info compact-alert fade-in">
                <i className="fas fa-info-circle me-2"></i>
                <small>No sections available for the selected class.</small>
              </div>
            ) : (
              <select
                className={`form-select ${errors.section ? 'is-invalid' : ''}`}
                {...register('section')}
              >
                <option value="">Select Section</option>
                {sectionOptions.map((section: SectionModel) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            )}
            {errors.section && <div className="invalid-feedback">{errors.section.message}</div>}
          </div>
        )}

       


        {/* Student List - Only show for individual target type */}
        {selectedTargetType === 'individual' && (
          <div className="col-md-12 mb-3 animated-field">
            <label className="form-label">
              Select Students <span className="text-danger">*</span>
            </label>
            {!selectedClassId ? (
              <div className="alert alert-info fade-in">
                Please select a class first to view students.
              </div>
            ) : filteredStudentOptions.length === 0 ? (
              <div className="alert alert-warning fade-in">
                No students found for the selected class{selectedTargetType === 'individual' && watchedSectionId ? ' and section' : ''}.
              </div>
            ) : (
              <Controller
                name="student_ids"
                control={control}
                render={({ field: { value = [], onChange } }) => (
                  <div className="border p-3 rounded student-list-container fade-in">
                    {filteredStudentOptions.map((student: StudentModel, index) => (
                      <div 
                        className="form-check slide-in" 
                        key={student.id}
                        style={{ 
                          animationDelay: `${index * 0.05}s`,
                          animationDuration: '0.3s'
                        }}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={value.includes(student.id!)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onChange([...value, student.id!]);
                            } else {
                              onChange(value.filter((id: string) => id !== student.id));
                            }
                          }}
                          id={`student-${student.id}`}
                        />
                        <label className="form-check-label" htmlFor={`student-${student.id}`}>
                          {student.user?.first_name} {student.user?.last_name} 
                          {student.roll_number && ` (Roll: ${student.roll_number})`}
                          {student.section_name && ` - Section: ${student.section_name}`}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              />
            )}
            {errors.student_ids && <div className="text-danger mt-1">{errors.student_ids.message}</div>}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-light me-2"
          onClick={() => onActiveModal(null)}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {mode === 'add' ? 'Add Assignment' : 'Update Assignment'}
        </button>
      </div>
    </form>
    </>
  );
};

export default AssignmentForm;