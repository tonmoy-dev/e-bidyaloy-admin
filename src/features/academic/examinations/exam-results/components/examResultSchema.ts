
import * as yup from 'yup';

export const examResultSchema = yup.object({
  id: yup.string().optional(),
  examId: yup.string().required('Examination is required'),
  classId: yup.string().required('Class is required'),
  sectionId: yup.string().optional(),
  marks: yup.array().of(
    yup.object({
      studentId: yup.string().required('Student is required'),
      marks: yup.array().of(
        yup.object({
          subjectId: yup.string().required('Subject is required'),
          mark: yup.number().required('Mark is required').min(0, 'Mark must be a positive number'),
          remarks: yup.string().optional(),
        })
      ),
    })
  ),
});
