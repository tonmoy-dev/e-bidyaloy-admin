// models/student.model.ts

export type UUID = string;

export type StudentStatus = 'active' | 'inactive';
export type GenderType = 'male' | 'female' | 'other';

export interface UserModel {
    id: UUID;
    username: string;
    email?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    full_name?: string;
    phone?: string;
    date_of_birth?: string; // ISO date (YYYY-MM-DD)
    gender?: GenderType | string;
    address?: string;
    profile_picture_url?: string;
    user_type?: string;
    organization?: UUID;
    organization_name?: string;
    email_verified_at?: string | null; // ISO datetime
    last_login_at?: string | null; // ISO datetime
    preferences?: Record<string, any>;
    roles?: string | string[];
    is_active?: boolean;
    date_joined?: string; // ISO datetime
}

export interface StudentModel {
    // core identifiers
    id?: UUID;
    student_id?: string;
    admission_number?: string;
    admission_date?: string; // ISO date (YYYY-MM-DD)
    roll_number?: string;
    status?: StudentStatus;

    // guardian info (from payload)
    guardian_name?: string;
    guardian_phone?: string;
    guardian_email?: string;
    guardian_relationship?: string;

    // miscellaneous / health / facilities
    previous_school?: string;
    medical_conditions?: string;
    special_needs?: string;
    transport_required?: boolean;
    hostel_required?: boolean;

    // nested user object
    user: UserModel;

    // organization / academic assignment
    organization?: UUID;
    organization_name?: string;
    academic_year?: UUID;
    academic_year_name?: string;
    class_assigned?: UUID;
    class_name?: string;
    grade_name?: string;
    section?: UUID;
    section_name?: string;

    // personal info (kept for backward compatibility with older model)
    first_name?: string;
    last_name?: string;
    gender?: GenderType | string;
    email?: string;
    date_of_birth?: string; // ISO date (YYYY-MM-DD)
    address?: string;
    phone?: string;
    profile_picture_url?: string;
    blood_group?: string;

    // meta
    age?: string | number;
    created_at?: string; // ISO datetime
    updated_at?: string; // ISO datetime
}

// Keep the old alias for backward compatibility
export type studentModel = StudentModel;

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
export type StudentPaginatedResponse = PaginatedResponse<studentModel>;


