import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useGetStudentsQuery } from '../../../peoples/students/api/studentApi';
import type { StudentModel } from '../../../peoples/students/models/student.model';
import { useGetTeachersQuery } from '../../../peoples/teacher/api/teacherApi';
import { useSubjects } from '../../class-subject/hooks/useGetSubjectsQuery';
import { useClasses } from '../../classes/hooks/useClasses';
import type { SectionModel } from '../../classes/models/class.model';
import { useSessions } from '../../sessions/hooks/useSessions';
import type { AssignmentFormData, AssignmentModel } from '../models/assignment.model';
import { assignmentSchema } from '../models/assignment.schema';
import FileUploadComponent from './FileUploadComponent';

interface AssignmentFormProps {
  mode: 'add' | 'edit';
  defaultValues?: AssignmentModel;
  onSubmit: (
    data: AssignmentFormData,
  ) => Promise<
    { createdAssignment?: AssignmentModel; shouldUploadAttachments?: boolean } | undefined
  > | void;
  onActiveModal: (modal: string | null) => void;
  assignmentId?: string; // For two-step process when uploading attachments after assignment creation
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  mode,
  defaultValues,
  onSubmit,
  onActiveModal,
  assignmentId,
}) => {
  const [selectedTargetType, setSelectedTargetType] = useState<'class' | 'section' | 'individual'>(
    'class',
  );
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'assignment' | 'attachments'>('assignment');
  const [createdAssignmentId, setCreatedAssignmentId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm({
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
      attachments: [],
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
    const selectedClass = classOptions.find((cls) => cls.id === selectedClassId);
    return selectedClass?.sections || [];
  }, [classOptions, selectedClassId]);

  const subjectOptions = useMemo(() => {
    if (!subjects?.results || !selectedClassId) return [];

    // Get the selected class name to filter subjects
    const selectedClass = classOptions.find((cls) => cls.id === selectedClassId);
    const selectedClassName = selectedClass?.name;

    if (!selectedClassName) return [];

    // Filter subjects by the selected class name
    return subjects.results.filter((subject) => subject.classes === selectedClassName);
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
      (student: StudentModel) => student.class_assigned === selectedClassId,
    );

    // If section is selected, always filter by section for individual target type
    if (selectedTargetType === 'individual' && watchedSectionId) {
      filtered = filtered.filter((student: StudentModel) => student.section === watchedSectionId);
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
        due_date: defaultValues.due_date
          ? new Date(defaultValues.due_date).toISOString().split('T')[0]
          : '',
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

  const handleFormSubmit = async (data: AssignmentFormData) => {
    // Validate due date is not in the past (compare date-only)
    if (data.due_date) {
      try {
        const selected = new Date(data.due_date);
        const today = new Date();
        // normalize to date-only (midnight)
        selected.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          toast.error('Due date cannot be in the past.');
          return; // prevent further processing
        }
      } catch {
        // ignore parse errors and let schema handle invalid format
      }
    }
    if (currentStep === 'assignment') {
      if (mode === 'edit') {
        // Edit mode: Create assignment with attachments in one step
        const formattedData = {
          ...data,
          due_date: new Date(data.due_date).toISOString(),
        };
        await onSubmit(formattedData);
        // Edit mode closes modal immediately
        onActiveModal(null);
      } else {
        // Add mode: Just go to next step (attachments) - don't create assignment yet
        setCurrentStep('attachments');
      }
    } else {
      // Second step: Create assignment first without attachments
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { attachments, ...assignmentData } = data;
      const formattedData = {
        ...assignmentData,
        due_date: new Date(data.due_date).toISOString(),
      };

      const result = await onSubmit(formattedData);

      // If assignment created successfully, store the ID for file uploads
      if (result?.createdAssignment?.id) {
        setCreatedAssignmentId(result.createdAssignment.id);
        // The FileUploadComponent will now upload files with the assignment ID
        // Let the files upload in the background, then close modal
        setTimeout(() => {
          onActiveModal(null);
        }, 1000); // Give files time to upload
      } else {
        // No assignment ID, just close
        onActiveModal(null);
      }
    }
  };

  // Handle "Skip Attachments" button - creates assignment without attachments
  const handleSkipAttachments = async () => {
    const formData = watch(); // Get current form data
    const formattedData = {
      ...formData,
      due_date: new Date(formData.due_date).toISOString(),
      attachments: [], // No attachments
    };

    await onSubmit(formattedData);
    onActiveModal(null);
  };

  // Handle file uploads
  const handleFilesUploaded = (attachmentIds: string[]) => {
    setValue('attachments', attachmentIds);
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
        
        /* Step Indicator Styles */
        .step-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .step-number {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          background-color: #e9ecef;
          color: #6c757d;
          transition: all 0.3s ease;
        }
        
        .step-indicator.active .step-number {
          background-color: #0d6efd;
          color: white;
        }
        
        .step-indicator.completed .step-number {
          background-color:  #0d6efd;
          color: white;
        }
        
        .step-text {
          font-weight: 500;
          color: #6c757d;
          transition: all 0.3s ease;
        }
        
        .step-indicator.active .step-text {
          color: #0d6efd;
        }
        
        .step-indicator.completed .step-text {
          color: #0d6efd;
        }
        
        .step-line {
          flex: 1;
          height: 2px;
          background-color: #e9ecef;
          margin: 0 1rem;
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

        .student-check-item {
          transition: all 0.2s ease-in-out;
        }

        .student-check-item:hover {
          background-color: rgba(0, 123, 255, 0.1);
          border-radius: 0.25rem;
          padding: 0.25rem;
          margin: 0.1rem 0;
        }

        /* Mobile modal fixes */
        @media (max-width: 768px) {
          .modal-dialog {
            margin: 0.5rem !important;
            max-width: calc(100% - 1rem) !important;
            max-height: calc(100vh - 1rem) !important;
          }
          
          .modal-content {
            max-height: calc(100vh - 1rem) !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .modal-body {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: 1rem !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          .modal-header {
            flex-shrink: 0 !important;
            padding: 0.75rem 1rem !important;
            border-bottom: 1px solid #dee2e6 !important;
          }
          
          .modal-footer {
            flex-shrink: 0 !important;
            padding: 0.75rem 1rem !important;
            border-top: 1px solid #dee2e6 !important;
            background-color: #f8f9fa !important;
          }
        }

        /* Additional mobile optimizations */
        @media (max-width: 576px) {
          .modal-dialog {
            margin: 0 !important;
            max-width: 100% !important;
            height: 100vh !important;
            max-height: 100vh !important;
          }
          
          .modal-content {
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
          }
          
          .modal-body {
            padding: 0.75rem !important;
          }
          
          .modal-header .modal-title {
            font-size: 1.1rem !important;
          }
          
          .btn {
            padding: 0.5rem 1rem !important;
            font-size: 0.9rem !important;
          }
          
          .form-control, .form-select {
            font-size: 16px !important; /* Prevent zoom on iOS */
          }
          
          .row .col-md-6, .row .col-md-4, .row .col-md-12 {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            margin-bottom: 0.75rem !important;
          }
          
          .form-label {
            font-size: 0.9rem !important;
            margin-bottom: 0.25rem !important;
          }
          
          .form-text small {
            font-size: 0.8rem !important;
          }
        }

        /* Ensure modal backdrop doesn't interfere with scrolling */
        body .modal-open {
          overflow: hidden !important;
        }

        /* Ensure modal backdrop doesn't interfere with scrolling */
        body .modal-open {
          overflow: hidden !important;
        }

        /* Global modal fixes that apply to any modal on the page */
        @media (max-width: 768px) {
          body .modal-dialog {
            margin: 0.5rem !important;
            max-width: calc(100vw - 1rem) !important;
            max-height: calc(100vh - 1rem) !important;
          }
          
          body .modal-content {
            max-height: calc(100vh - 1rem) !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
          }
          
          body .modal-body {
            flex: 1 !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            padding: 1rem !important;
          }
          
          body .modal-header {
            flex-shrink: 0 !important;
            padding: 0.75rem 1rem !important;
          }
          
          body .modal-footer {
            flex-shrink: 0 !important;
            padding: 0.75rem 1rem !important;
          }
        }

        @media (max-width: 576px) {
          body .modal-dialog {
            margin: 0 !important;
            max-width: 100vw !important;
            width: 100vw !important;
            height: 100vh !important;
            max-height: 100vh !important;
          }
          
          body .modal-content {
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            border: none !important;
          }
          
          body .modal-body {
            padding: 0.75rem !important;
          }
          
          body .modal-header {
            padding: 0.75rem !important;
            border-bottom: 1px solid #dee2e6 !important;
          }
          
          body .modal-footer {
            padding: 0.75rem !important;
            border-top: 1px solid #dee2e6 !important;
          }
        }
      `}</style>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Step Indicator */}
        {mode === 'add' && (
          <div className="mb-4">
            <div className="d-flex align-items-center">
              <div
                className={`step-indicator ${
                  currentStep === 'assignment' ? 'active' : 'completed'
                }`}
              >
                <span className="step-number">1</span>
                <span className="step-text">Assignment Details</span>
              </div>
              <div className="step-line"></div>
              <div className={`step-indicator ${currentStep === 'attachments' ? 'active' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-text">Upload Attachments</span>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          {/* Step 1: Assignment Details */}
          {(mode === 'edit' || currentStep === 'assignment') && (
            <>
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
                {errors.description && (
                  <div className="invalid-feedback">{errors.description.message}</div>
                )}
              </div>

              {/* Instructions */}
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Instructions For Students<span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
                  rows={1}
                  {...register('instructions')}
                  placeholder="Enter assignment instructions"
                />
                {errors.instructions && (
                  <div className="invalid-feedback">{errors.instructions.message}</div>
                )}
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
                {errors.academic_year && (
                  <div className="invalid-feedback">{errors.academic_year.message}</div>
                )}
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
                {errors.total_marks && (
                  <div className="invalid-feedback">{errors.total_marks.message}</div>
                )}
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
                {errors.assigned_by && (
                  <div className="invalid-feedback">{errors.assigned_by.message}</div>
                )}
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
                {errors.due_date && (
                  <div className="invalid-feedback">{errors.due_date.message}</div>
                )}
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
                {errors.target_type && (
                  <div className="invalid-feedback">{errors.target_type.message}</div>
                )}
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
                {errors.class_assigned && (
                  <div className="invalid-feedback">{errors.class_assigned.message}</div>
                )}
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
                  {errors.section && (
                    <div className="invalid-feedback">{errors.section.message}</div>
                  )}
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
                      No students found for the selected class
                      {selectedTargetType === 'individual' && watchedSectionId
                        ? ' and section'
                        : ''}
                      .
                    </div>
                  ) : (
                    <Controller
                      name="student_ids"
                      control={control}
                      render={({ field: { value = [], onChange } }) => (
                        <div className="border p-3 rounded student-list-container fade-in">
                          {filteredStudentOptions.map((student: StudentModel, index) => (
                            <div
                              className="form-check slide-in student-check-item"
                              key={student.id}
                              data-animation-delay={index * 0.05}
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
                  {errors.student_ids && (
                    <div className="text-danger mt-1">{errors.student_ids.message}</div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Step 2: File Attachments */}
          {(mode === 'edit' || currentStep === 'attachments') && (
            <div className="col-md-12 mb-3">
              {mode === 'add' && currentStep === 'attachments' && (
                <div className="alert alert-info mb-3">
                  <i className="fas fa-paperclip me-2"></i>
                  <strong>Step 2:</strong> Upload assignment files, reference materials, or
                  instructions. This step is optional - you can skip it if no files are needed.
                </div>
              )}
              <label className="form-label">
                <i className="fas fa-paperclip me-2"></i>
                Assignment Files (Optional)
              </label>
              <FileUploadComponent
                onFilesUploaded={handleFilesUploaded}
                maxFiles={5}
                maxFileSize={10 * 1024 * 1024} // 10MB
                acceptedFileTypes={[
                  '.pdf',
                  '.doc',
                  '.docx',
                  '.txt',
                  '.jpg',
                  '.jpeg',
                  '.png',
                  '.gif',
                ]}
                disabled={false}
                assignmentId={
                  mode === 'edit' ? defaultValues?.id : createdAssignmentId || assignmentId
                }
              />
              <div className="form-text">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Upload assignment files, reference materials, or instructions. Maximum 5 files,
                  10MB each. Supported: PDF, Word, Text, Images.
                </small>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light me-2"
            onClick={() => {
              reset(); // Reset form on cancel
              onActiveModal(null);
            }}
          >
            Cancel
          </button>

          {/* Step-specific buttons for Add mode */}
          {mode === 'add' && currentStep === 'assignment' && (
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-arrow-right me-2"></i>
              Next: Upload Attachments
            </button>
          )}

          {mode === 'add' && currentStep === 'attachments' && (
            <>
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => {
                  // Go back to assignment step
                  setCurrentStep('assignment');
                }}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Details
              </button>
              <button
                type="button"
                className="btn btn-outline-primary me-2"
                onClick={handleSkipAttachments}
              >
                <i className="fas fa-forward me-2"></i>
                Skip Attachments
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-check me-2"></i>
                Create Assignment
              </button>
            </>
          )}

          {/* Edit mode button */}
          {mode === 'edit' && (
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-save me-2"></i>
              Update Assignment
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default AssignmentForm;
