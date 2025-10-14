import * as yup from "yup";

export const examTypeSchema = yup.object({
  name: yup.string().required("Exam Type Name is required"),
  description: yup.string().required("Description is required"),
  weightage: yup.string().required("Weightage is required"),
  is_active: yup.boolean().default(true),
  organization: yup.string().optional(),
});