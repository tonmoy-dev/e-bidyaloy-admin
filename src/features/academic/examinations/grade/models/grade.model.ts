export interface GradeModel {
  id: string;
  name: string;
  level: number;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
