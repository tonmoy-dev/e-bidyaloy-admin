import * as yup from "yup";
import type { ClassModel } from "./class.model";

export const classSchema: yup.ObjectSchema<ClassModel> = yup.object({
  id: yup.number().optional(),
  name: yup.string().required("Class Name is required"),
  is_active: yup.boolean().optional(),
  class_teacher: yup.string().required("Class Teacher is required"),
  sections: yup.array().of(yup.object({
    id: yup.number().optional(),
    name: yup.string().required("Section Name is required"),
    teacher: yup.string().required("Teacher is required"),
    is_active: yup.boolean().optional(),
  })),
});
