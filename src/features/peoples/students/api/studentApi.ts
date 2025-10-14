import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';
import type { PaginatedResponse, StudentModel } from '../models/student.model'; 

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<PaginatedResponse<StudentModel>, number | void>({
      query: (page = 1) => `${API_ENDPOINTS.STUDENT.LIST}?page=${page}`,
        providesTags: (result) =>   
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Student' as const, id })),
              { type: 'Student', id: 'LIST' },
            ]
            : [{ type: 'Student', id: 'LIST' }],
    }),
    getStudentById: builder.query<StudentModel, string>({
      query: (id) => `${API_ENDPOINTS.STUDENT.DETAILS_BY_ID}${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Student', id }],
    }),
    createStudent: builder.mutation<StudentModel, Partial<StudentModel>>({
      query: (newStudent) => ({
        url: API_ENDPOINTS.STUDENT.CREATE,
        method: 'POST',
        body: newStudent,
      }),
      invalidatesTags: [{ type: 'Student', id: 'LIST' }],
    }),
    updateStudent: builder.mutation<StudentModel, { id: string; data: Partial<StudentModel> }>({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.STUDENT.DETAILS_BY_ID}${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result,_error, { id }) => 
        [{ type: 'Student', id }, { type: 'Student', id: 'LIST' }],

    }),
    deleteStudent: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.STUDENT.DETAILS_BY_ID}${id}/`,    
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => 
        [
            { type: 'Student', id }, 
            { type: 'Student', id: 'LIST' }],
    }),


  }),
  overrideExisting: false,
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
