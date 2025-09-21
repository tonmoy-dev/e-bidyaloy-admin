import * as yup from "yup";

export interface SectionModel {
  id?: string;
  name?: string;
  section_teacher_id?: string;
  is_active?: boolean;
}

export interface ClassModel {
  id?: string;
  name: string;
  class_teacher_id?: string;
  sections?: SectionModel[];
  is_active?: boolean;
}


export const classSchema: yup.ObjectSchema<ClassModel> = yup.object({
  id: yup.string().optional(),
  name: yup.string().required("Class Name is required"),
  is_active: yup.boolean().optional(),
  class_teacher_id: yup.string().optional(),
  sections: yup.array().of(
    yup.object({
      id: yup.string().optional(),
      name: yup.string().optional(),
      section_teacher_id: yup.string().optional(),
      is_active: yup.boolean().optional(),
    })
  ).optional(),
});
