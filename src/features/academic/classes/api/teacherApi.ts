
import { API_ENDPOINTS } from "../../../../core/constants/api";
import { baseApi } from "../../../../core/services/baseApi";

export interface UserModel {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  full_name: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  profile_picture_url: string;
  user_type: string;
  organization: string;
  organization_name: string;
  email_verified_at: string | null;
  last_login_at: string | null;
  preferences: Record<string, any>;
  roles: any[];
  is_active: boolean;
  date_joined: string;
}

export interface TeacherModel {
  id: string; // Changed from number to string (UUID)
  employee_id: string | null;
  department: string;
  designation: string;
  hire_date: string;
  employment_type: string;
  salary: number | null;
  salary_currency: string;
  bank_account_number: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  qualifications: string;
  experience_years: number;
  specialization: string;
  teaching_license: string;
  license_expiry_date: string | null;
  max_classes_per_week: number;
  is_active: boolean;
  termination_date: string | null;
  termination_reason: string;
  user: UserModel; // Nested user object
  organization: string;
  organization_name: string;
  age: number;
  specializations: any[];
  created_at: string;
  updated_at: string;
}
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<PaginatedResponse<TeacherModel>, number>({
      query: (page = 1) => API_ENDPOINTS.TEACHER.LIST({ page }),
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({ type: "Teacher" as const, id })),
            { type: "Teacher", id: "LIST" },
          ]
          : [{ type: "Teacher", id: "LIST" }],
    }),

    getTeacherById: builder.query<TeacherModel, number>({
      query: (id) => API_ENDPOINTS.TEACHER.DETAILS(id),
      providesTags: (_result, _error, id) => [{ type: "Teacher", id }],
    }),

    createTeacher: builder.mutation<TeacherModel, Partial<TeacherModel>>({
      query: (newTeacher) => ({
        ...API_ENDPOINTS.TEACHER.CREATE(),
        body: newTeacher,
      }),
      invalidatesTags: [{ type: "Teacher", id: "LIST" }],
    }),

    updateTeacher: builder.mutation<
      TeacherModel,
      { id: number; data: Partial<TeacherModel> }
    >({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.TEACHER.UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Teacher", id },
        { type: "Teacher", id: "LIST" },
      ],
    }),

    deleteTeacher: builder.mutation<void, number>({
      query: (id) => ({
        ...API_ENDPOINTS.TEACHER.DELETE(id),
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Teacher", id },
        { type: "Teacher", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
