import * as yup from "yup";
import type { ClassModel } from "./class.model";

export const classSchema: yup.ObjectSchema<ClassModel> = yup.object({
  id: yup.number().optional(),
  name: yup.string().required("Class Name is required"),
  is_active: yup.boolean().required(),
  academic_year: yup.string().required("Academic Year is required"),
});
