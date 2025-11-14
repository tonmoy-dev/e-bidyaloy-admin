import * as yup from 'yup';

export const examResultSchema = yup.object({
  id: yup.string().optional(),
  examId: yup.string().required('Examination is required'),
  class_id: yup.string().required('Class is required'),
  section_id: yup.string().optional(),
  exam_subject: yup.string().required('Exam subject is required'),
  marks: yup
    .array()
    .of(
      yup.object({
        studentId: yup.string().required('Student is required'),
        studentRollNo: yup.string().optional(),
        marksObtained: yup
          .number()
          .transform((value, originalValue) => {
            // Handle empty string or null
            if (originalValue === '' || originalValue === null) return 0;
            return value;
          })
          .min(0, 'Marks must be a positive number')
          .optional(),
        grade: yup.string().optional(),
        is_absent: yup.boolean().optional(),
        remarks: yup.string().optional(),
      }),
    )
    .min(1, 'At least one student is required'),
});
