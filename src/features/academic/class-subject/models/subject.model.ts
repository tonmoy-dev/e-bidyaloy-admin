export enum SubjectTypeEnum {
  CORE = 'CORE',
  ELECTIVE = 'ELECTIVE',
  PRACTICAL = 'PRACTICAL',
  THEORY = 'THEORY',
  LAB = 'LAB',
  EXTRACURRICULAR = 'EXTRACURRICULAR',
}

export interface SubjectModel {
  id: string; // UUID string
  name: string;
  code: string;
  description: string;
  subject_type: SubjectTypeEnum;
  is_active: boolean;
  organization: string; // UUID string
  organization_name: string;
  teacher_count: number;
  created_at: string; // ISO date string
}

// For create/update operations where some fields might be optional
export interface CreateSubjectRequest {
  name: string;
  code: string;
  description?: string;
  subject_type: SubjectTypeEnum;
  is_active?: boolean;
  organization: string; // UUID string
}

export interface UpdateSubjectRequest {
  name?: string;
  code?: string;
  description?: string;
  subject_type?: SubjectTypeEnum;
  is_active?: boolean;
  organization?: string; // UUID string
}
