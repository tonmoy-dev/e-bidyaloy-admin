// models/student.model.ts

export type UUID = string;

export type StudentStatus = 'active' | 'inactive';
export type GenderType = 'male' | 'female' | 'other';

export interface StudentModel {
    id?: UUID;
    first_name: string;
    last_name: string;
    gender: GenderType;
    student_id: string;
    email: string;
    admission_number: string;
    admission_date: string; // ISO date (YYYY-MM-DD)
    roll_number: string;
    status: StudentStatus;
    class_assigned: UUID;
    section: UUID;
}

// Keep the old interface for backward compatibility
export type studentModel = StudentModel;
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
export type StudentPaginatedResponse = PaginatedResponse<studentModel>;


