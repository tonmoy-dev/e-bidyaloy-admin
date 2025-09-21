import type { TeacherModel } from "../api/teacherApi";

export interface ClassModel {
  id?: string;
  name: string;
  class_teacher_id?: string;
  class_teacher?: TeacherModel;
  sections?: SectionModel[];
  is_active?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SectionModel {
  id?: string;
  name?: string;
  section_teacher?: TeacherModel;
  section_teacher_id?: string;
  is_active?: boolean;
}





