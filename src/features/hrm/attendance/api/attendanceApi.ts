import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';

export interface AttendanceStudentEntry {
  student_id: string;
  status: string;
  remarks?: string;
}

export interface AttendanceBulkPayload {
  class_id: string;
  section_id: string;
  subject_id: string;
  attendance_date: string;
  students: AttendanceStudentEntry[];
}

export interface StudentWithAttendance {
  id: string;
  name: string;
  roll: string;
  class_name: string;
  section_name: string;
  attendance_status?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET student list with attendance
    getStudentListWithAttendance: builder.query<
      PaginatedResponse<StudentWithAttendance>,
      Record<string, unknown> | void
    >({
      query: (params) => ({
        url: API_ENDPOINTS.ATTENDANCE.STUDENT_LIST_WITH_ATTENDANCE().url,
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'Attendance', id: 'LIST' }],
    }),

    // 🔹 POST bulk create/update attendance
    bulkMarkAttendance: builder.mutation<any, AttendanceBulkPayload>({
      query: (body) => ({
        url: API_ENDPOINTS.ATTENDANCE.BULK_MARK.url,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Attendance', id: 'LIST' }],
    }),
  }),

  overrideExisting: false,
});

export const { useGetStudentListWithAttendanceQuery, useBulkMarkAttendanceMutation } =
  attendanceApi;
