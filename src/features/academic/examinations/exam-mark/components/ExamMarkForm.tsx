import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useClassesWithoutPagination } from '../../../class-subject/hooks/useGetClassesQueryWP';
import { useSubjectsWithoutPagination } from '../../../class-syllabus/hooks/useSubjectsWP';
import { useExamMarkMutations } from '../hooks/useExamMarkMutations';
import { useExamsWithoutPagination } from '../hooks/useExamsWP';
import { useStudentsWithoutPagination } from '../hooks/useStudentsWP';
import { examMarkFormSchema, type ExamMarkFormSchema } from '../models/exam-mark.schema';

import CommonSelect from '../../../../../core/common/commonSelect';
import type { ClassOption, ExamOption, StudentOption, SubjectOption } from '../models/common.model';

interface ExamMarkFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<ExamMarkFormSchema>;
}

const ExamMarkForm: React.FC<ExamMarkFormProps> = ({ onSuccess, onCancel, initialData }) => {
  const [filteredStudents, setFilteredStudents] = useState<StudentOption[]>([]);
  const [totalMarks, setTotalMarks] = useState<number>(100);

  const { exams, isLoading: examsLoading } = useExamsWithoutPagination();
  const { students, isLoading: studentsLoading } = useStudentsWithoutPagination();
  const { subjects, isLoading: subjectsLoading } = useSubjectsWithoutPagination();
  const { classes, isLoading: classesLoading } = useClassesWithoutPagination();
  const { bulkCreateExamMarks, isBulkCreating } = useExamMarkMutations();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExamMarkFormSchema>({
    resolver: yupResolver(examMarkFormSchema),
    defaultValues: {
      exam: initialData?.exam || '',
      subject: initialData?.subject || '',
      class: initialData?.class || '',
      section: initialData?.section || '',
      studentMarks: initialData?.studentMarks || [],
    },
  });

  const watchedClass = watch('class');
  const watchedSection = watch('section');

  // Filter students based on selected class and section
  useEffect(() => {
    if (students && watchedClass) {
      let filtered = students.filter((student) => student.class_id === watchedClass);

      if (watchedSection) {
        filtered = filtered.filter((student) => student.section_id === watchedSection);
      }

      setFilteredStudents(filtered);

      // Initialize student marks for filtered students
      const studentMarks = filtered.map((student) => ({
        student: student.id,
        student_name: student.name,
        student_roll: student.roll_number,
        marks_obtained: 0,
        total_marks: totalMarks,
        grade: '',
        remarks: '',
      }));

      setValue('studentMarks', studentMarks);
    }
  }, [students, watchedClass, watchedSection, setValue, totalMarks]);

  const onSubmit = async (data: ExamMarkFormSchema) => {
    try {
      const bulkData = {
        exam: data.exam,
        subject: data.subject,
        class: data.class,
        section: data.section,
        marks: data.studentMarks.map((studentMark) => ({
          student: studentMark.student,
          marks_obtained: studentMark.marks_obtained,
          total_marks: studentMark.total_marks,
          grade: studentMark.grade,
          remarks: studentMark.remarks,
        })),
      };

      const result = await bulkCreateExamMarks(bulkData);

      if (result.success) {
        onSuccess?.();
      } else {
        console.error('Failed to create exam marks:', result.error);
      }
    } catch (error) {
      console.error('Error creating exam marks:', error);
    }
  };

  const examOptions: ExamOption[] =
    exams?.map((exam) => ({
      value: exam.id,
      label: exam.name,
      id: exam.id,
      name: exam.name,
      exam_date: exam.exam_date,
    })) || [];

  const subjectOptions: SubjectOption[] =
    subjects?.map((subject) => ({
      value: subject.id,
      label: subject.name,
      id: subject.id,
      name: subject.name,
      code: subject.code,
    })) || [];

  const classOptions: ClassOption[] =
    classes?.map((cls) => ({
      value: cls.id,
      label: cls.name,
      id: cls.id,
      name: cls.name,
      code: cls.code,
    })) || [];

  if (examsLoading || studentsLoading || subjectsLoading || classesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Exam *</label>
            <Controller
              name="exam"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  options={examOptions}
                  value={field.value}
                  onChange={field.onChange}
                  className="form-control"
                />
              )}
            />
            {errors.exam && <div className="text-danger small">{errors.exam.message}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Subject *</label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  options={subjectOptions}
                  value={field.value}
                  onChange={field.onChange}
                  className="form-control"
                />
              )}
            />
            {errors.subject && <div className="text-danger small">{errors.subject.message}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Class *</label>
            <Controller
              name="class"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  options={classOptions}
                  value={field.value}
                  onChange={field.onChange}
                  className="form-control"
                />
              )}
            />
            {errors.class && <div className="text-danger small">{errors.class.message}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Section (Optional)</label>
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  options={[]} // TODO: Add section options when available
                  value={field.value}
                  onChange={field.onChange}
                  className="form-control"
                />
              )}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Total Marks</label>
            <input
              type="number"
              className="form-control"
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Student Marks Section */}
      {filteredStudents.length > 0 && (
        <div className="mb-4">
          <h5>Student Marks</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Student Name</th>
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td>{student.roll_number}</td>
                    <td>{student.name}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        min="0"
                        max={totalMarks}
                        value={watch(`studentMarks.${index}.marks_obtained`) || 0}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setValue(`studentMarks.${index}.marks_obtained`, value);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={totalMarks}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setTotalMarks(value);
                          setValue(`studentMarks.${index}.total_marks`, value);
                        }}
                        min="1"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={watch(`studentMarks.${index}.grade`) || ''}
                        onChange={(e) => {
                          setValue(`studentMarks.${index}.grade`, e.target.value);
                        }}
                        placeholder="A+, A, B+, etc."
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={watch(`studentMarks.${index}.remarks`) || ''}
                        onChange={(e) => {
                          setValue(`studentMarks.${index}.remarks`, e.target.value);
                        }}
                        placeholder="Optional remarks"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-light"
          onClick={onCancel}
          disabled={isSubmitting || isBulkCreating}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting || isBulkCreating}>
          {isSubmitting || isBulkCreating ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Saving...
            </>
          ) : (
            'Save Exam Marks'
          )}
        </button>
      </div>
    </form>
  );
};

export default ExamMarkForm;
