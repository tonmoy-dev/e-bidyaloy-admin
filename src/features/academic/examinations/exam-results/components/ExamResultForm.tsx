import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useStudentById } from '../../../../peoples/students/hooks/useStudentById';
import { useGetClassesWithoutPaginationQuery } from '../api/examResultApi';
import { useGetExams } from '../hooks/useGetExams';
import { useGetGradesWP } from '../hooks/useGetGradesWP';
import { useGetStudentsMinimal } from '../hooks/useGetStudentsMinimal';
import type { ExamResultModel } from '../models/examResult.model';
import { examResultSchema } from './examResultSchema';

interface ExamResultFormProps {
  defaultValues?: ExamResultModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: any) => Promise<void> | void;
  onActiveModal: (modalType: null) => void;
}

export default function ExamResultForm({ mode, defaultValues, onSubmit }: ExamResultFormProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [classSections, setClassSections] = useState<any[]>([]);
  const [examSubjects, setExamSubjects] = useState<any[]>([]);

  const { exams } = useGetExams();
  const { data: classes } = useGetClassesWithoutPaginationQuery();
  const { grades } = useGetGradesWP();
  const { studentDetails } = useStudentById(mode === 'edit' ? defaultValues?.student : null);

  // Build params object for the query
  const studentQueryParams = {
    class_assigned: selectedClass || undefined,
    section: selectedSection || undefined,
  };

  const {
    students,
    refetch,
    isLoading: studentsLoading,
  } = useGetStudentsMinimal(studentQueryParams);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: yupResolver(examResultSchema),
    mode: 'onSubmit',
    defaultValues: {
      id: defaultValues?.id ?? '',
      examId: defaultValues?.examinationId ?? '',
      class_id: defaultValues?.class_id ?? '',
      section_id: defaultValues?.section_id ?? '',
      exam_subject: defaultValues?.exam_subject ?? '',
      marks: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'marks',
  });

  const watchClass = watch('class_id');
  const watchSection = watch('section_id');
  const watchExam = watch('examId');

  // Update selected class and section
  useEffect(() => {
    if (watchClass === selectedClass) return;
    setSelectedClass(watchClass || null);
    const selectedClassData = classes?.find((c: any) => c.id === watchClass);
    setClassSections(selectedClassData?.sections || []);
    setValue('section_id', '');
    setSelectedSection(null);
  }, [watchClass, selectedClass, classes, setValue]);

  useEffect(() => {
    if (watchSection !== selectedSection) {
      setSelectedSection(watchSection || null);
    }
  }, [watchSection, selectedSection]);

  useEffect(() => {
    if (watchExam) {
      const selectedExam = exams?.find((e: any) => e.id === watchExam);
      setExamSubjects(selectedExam?.exam_subjects || []);
      setValue('exam_subject', '');
    } else {
      setExamSubjects([]);
    }
  }, [watchExam, exams, setValue]);

  // Refetch students when class or section changes
  useEffect(() => {
    if (selectedClass) {
      refetch();
    }
  }, [selectedClass, selectedSection, refetch]);

  // Initialize marks array when students are available
  useEffect(() => {
    if (mode === 'edit' && defaultValues && studentDetails) {
      replace([
        {
          studentId: defaultValues.student,
          studentRollNo: studentDetails.student_id,
          marksObtained: defaultValues.marks_obtained,
          grade: defaultValues.grade,
          is_absent: defaultValues.is_absent,
          remarks: defaultValues.remarks,
        },
      ]);
      return;
    }

    if (students && Array.isArray(students) && students.length > 0) {
      const initialMarks = students.map((student: any) => ({
        studentId: student.id,
        studentRollNo: student.student_id,
        marksObtained: 0,
        grade: '',
        is_absent: false,
        remarks: '',
      }));
      replace(initialMarks);
    } else {
      replace([]);
    }
  }, [students, replace, mode, defaultValues, studentDetails]);

  useEffect(() => {
    if (mode === 'edit' && defaultValues && exams?.length) {
      const subjectId = defaultValues.exam_subject;
      const exam = exams.find((e: any) => e.exam_subjects.some((s: any) => s.id === subjectId));
      if (exam) {
        setValue('examId', exam.id);
      }
    }
  }, [mode, defaultValues, exams, setValue]);

  useEffect(() => {
    if (mode === 'edit' && defaultValues && examSubjects?.length) {
      if (examSubjects.some((s: any) => s.id === defaultValues.exam_subject)) {
        setValue('exam_subject', defaultValues.exam_subject);
      }
    }
  }, [mode, defaultValues, examSubjects, setValue]);

  // Transform data before submission
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data);

    // For edit mode, return single object
    if (mode === 'edit') {
      const mark = data.marks[0];
      const editPayload = {
        exam_subject: data.exam_subject,
        student: mark.studentId,
        marks_obtained: parseFloat(mark.marksObtained) || 0,
        grade: mark.grade || '',
        remarks: mark.remarks || '',
        is_absent: mark.is_absent || false,
      };

      console.log('Edit payload:', editPayload);
      onSubmit(editPayload);
      return;
    }

    // For add mode, transform nested marks array into flat array
    const transformedPayload = data.marks.map((mark: any) => {
      return {
        exam_subject: data.exam_subject,
        student: mark.studentId,
        marks_obtained: parseFloat(mark.marksObtained) || 0,
        grade: mark.grade || '',
        remarks: mark.remarks || '',
        is_absent: mark.is_absent || false,
        class_id: data.class_id,
        section_id: data.section_id,
      };
    });

    console.log('Transformed payload:', transformedPayload);

    // Call the original onSubmit with transformed data
    onSubmit(transformedPayload);
  };

  // Get students array safely - include studentDetails in edit mode
  const studentsList =
    mode === 'edit' && studentDetails ? [studentDetails] : Array.isArray(students) ? students : [];

  return (
    <form id="exam-result-form" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="row g-3">
        {/* Top Selection Fields */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Examination *</label>
                  <Controller
                    name="examId"
                    control={control}
                    render={({ field }) => (
                      <select
                        className={`form-select ${errors.examId ? 'is-invalid' : ''}`}
                        {...field}
                      >
                        <option value="">Select Examination</option>
                        {exams?.map((exam: any) => (
                          <option key={exam.id} value={exam.id}>
                            {exam.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.examId && <div className="invalid-feedback">{errors.examId.message}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Exam Subject *</label>
                  <Controller
                    name="exam_subject"
                    control={control}
                    render={({ field }) => (
                      <select
                        className={`form-select ${errors.exam_subject ? 'is-invalid' : ''}`}
                        {...field}
                      >
                        <option value="">Select Exam Subject</option>
                        {examSubjects?.map((subject: any) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.subject_name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.exam_subject && (
                    <div className="invalid-feedback">{errors.exam_subject.message}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Class *</label>
                  <Controller
                    name="class_id"
                    control={control}
                    render={({ field }) => (
                      <select
                        className={`form-select ${errors.class_id ? 'is-invalid' : ''}`}
                        {...field}
                        disabled={mode === 'edit'}
                      >
                        <option value="">Select Class</option>
                        {classes?.map((klass: any) => (
                          <option key={klass.id} value={klass.id}>
                            {klass.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.class_id && (
                    <div className="invalid-feedback">{errors.class_id.message}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Section (optional)</label>
                  <Controller
                    name="section_id"
                    control={control}
                    render={({ field }) => (
                      <select
                        className={`form-select ${errors.section_id ? 'is-invalid' : ''}`}
                        {...field}
                        disabled={mode === 'edit'}
                      >
                        <option value="">Select Section</option>
                        {classSections?.map((section: any) => (
                          <option key={section.id} value={section.id}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.section_id && (
                    <div className="invalid-feedback">{errors.section_id.message}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {studentsLoading && selectedClass && (
          <div className="col-md-12">
            <div className="alert alert-info text-center">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Loading students...
            </div>
          </div>
        )}

        {/* Student Marks Table */}
        {(studentsList.length > 0 || mode === 'edit') && !studentsLoading && (
          <div className="col-md-12">
            <div className="border rounded p-3 mb-3">
              <h6 className="mb-3">Student Marks Entry</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: '12%' }}>Roll No</th>
                          <th style={{ width: '18%' }}>Marks Obtained</th>
                          <th style={{ width: '25%' }}>Grade</th>
                          <th style={{ width: '20%' }}>Absent</th>
                          <th style={{ width: '35%' }}>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field: any, index: number) => {
                          const student = studentsList.find((s: any) => s.id === field.studentId);
                          const rollNo = field.studentRollNo || student?.student_id || 'N/A';
                          return (
                            <tr key={field.id}>
                              <td>
                                <div className="py-2 fw-semibold">{rollNo}</div>
                              </td>
                              <td>
                                <Controller
                                  name={`marks[${index}].marksObtained`}
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      type="number"
                                      step="0.01"
                                      className="form-control"
                                      placeholder="Enter marks"
                                      {...field}
                                    />
                                  )}
                                />
                              </td>
                              <td>
                                <Controller
                                  name={`marks[${index}].grade`}
                                  control={control}
                                  render={({ field }) => (
                                    <select className="form-select" {...field}>
                                      <option value="">Select Grade</option>
                                      {grades?.map((grade: any) => (
                                        <option key={grade.id} value={grade.id}>
                                          {grade.name}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                />
                              </td>
                              <td>
                                <Controller
                                  name={`marks[${index}].is_absent`}
                                  control={control}
                                  render={({ field }) => (
                                    <div className="d-flex gap-3 align-items-center py-2">
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          id={`absent-yes-${index}`}
                                          checked={field.value === true}
                                          onChange={() => field.onChange(true)}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`absent-yes-${index}`}
                                        >
                                          Yes
                                        </label>
                                      </div>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          id={`absent-no-${index}`}
                                          checked={field.value === false}
                                          onChange={() => field.onChange(false)}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`absent-no-${index}`}
                                        >
                                          No
                                        </label>
                                      </div>
                                    </div>
                                  )}
                                />
                              </td>
                              <td>
                                <Controller
                                  name={`marks[${index}].remarks`}
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter remarks"
                                      {...field}
                                    />
                                  )}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Students Message */}
        {selectedClass && !studentsLoading && studentsList.length === 0 && mode !== 'edit' && (
          <div className="col-md-12">
            <div className="alert alert-warning text-center">
              <i className="bi bi-exclamation-triangle me-2"></i>
              No students found for the selected class and section.
            </div>
          </div>
        )}

        {/* Instruction Message */}
        {!selectedClass && mode !== 'edit' && (
          <div className="col-md-12">
            <div className="alert alert-info text-center">
              Please select Examination and Class to view students.
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="col-md-12">
          <div className="mt-3">
            <button
              type="submit"
              form="exam-result-form"
              className="btn btn-primary"
              disabled={isSubmitting || (studentsList.length === 0 && mode !== 'edit')}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                <>{mode === 'edit' ? 'Update' : 'Add'} Exam Result</>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
