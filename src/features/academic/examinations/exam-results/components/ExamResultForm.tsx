import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useGetClassesWithoutPaginationQuery } from '../api/examResultApi';
import { useGetExams } from '../hooks/useGetExams';
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
    defaultValues: {
      id: defaultValues?.id ?? '',
      examId: defaultValues?.examinationId ?? '',
      classId: '',
      sectionId: '',
      exam_subject: '',
      marks: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'marks',
  });

  const watchClass = watch('classId');
  const watchSection = watch('sectionId');
  const watchExam = watch('examId');

  // Update selected class and section
  useEffect(() => {
    if (watchClass === selectedClass) return;
    setSelectedClass(watchClass || null);
    const selectedClassData = classes?.results?.find((c: any) => c.id === watchClass);
    setClassSections(selectedClassData?.sections || []);
    setValue('sectionId', '');
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
    if (students && Array.isArray(students) && students.length > 0) {
      const initialMarks = students.map((student: any) => ({
        studentId: student.id,
        studentRollNo: student.student_id,
        marksObtained: 0,
        remarks: '',
      }));
      replace(initialMarks);
    } else {
      replace([]);
    }
  }, [students, replace]);

  // Get students array safely
  const studentsList = Array.isArray(students) ? students : [];

  return (
    <form id="exam-result-form" onSubmit={handleSubmit(onSubmit)}>
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
                    name="classId"
                    control={control}
                    render={({ field }) => (
                      <select
                        className={`form-select ${errors.classId ? 'is-invalid' : ''}`}
                        {...field}
                      >
                        <option value="">Select Class</option>
                        {classes?.results?.map((klass: any) => (
                          <option key={klass.id} value={klass.id}>
                            {klass.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.classId && (
                    <div className="invalid-feedback">{errors.classId.message}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Section (optional)</label>
                  <Controller
                    name="sectionId"
                    control={control}
                    render={({ field }) => (
                      <select
                        className={`form-select ${errors.sectionId ? 'is-invalid' : ''}`}
                        {...field}
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
                  {errors.sectionId && (
                    <div className="invalid-feedback">{errors.sectionId.message}</div>
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
        {studentsList.length > 0 && !studentsLoading && (
          <div className="col-md-12">
            <div className="border rounded p-3 mb-3">
              <h6 className="mb-3">Student Marks Entry</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: '30%' }}>Roll No</th>
                          <th style={{ width: '35%' }}>Marks Obtained</th>
                          <th style={{ width: '35%' }}>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field: any, index: number) => {
                          const student = studentsList.find((s: any) => s.id === field.studentId);
                          return (
                            <tr key={field.id}>
                              <td>
                                <div className="py-2 fw-semibold">
                                  {student?.student_id || 'N/A'}
                                </div>
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
        {selectedClass && !studentsLoading && studentsList.length === 0 && (
          <div className="col-md-12">
            <div className="alert alert-warning text-center">
              <i className="bi bi-exclamation-triangle me-2"></i>
              No students found for the selected class and section.
            </div>
          </div>
        )}

        {/* Instruction Message */}
        {!selectedClass && (
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
              className="btn btn-primary"
              disabled={isSubmitting || studentsList.length === 0}
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
