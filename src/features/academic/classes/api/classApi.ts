// src/features/api/endpoints/classEndpoints.ts

import { API_ENDPOINTS } from "../../../../core/constants/api";
import { baseApi } from "../../../../core/services/baseApi";
import type { ClassModel, PaginatedResponse } from "../models/class.model";


export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<PaginatedResponse<ClassModel>, number | void>({
      query: (page = 1) => API_ENDPOINTS.CLASS.LIST({ page }),
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({ type: 'Class' as const, id })),
            { type: 'Class', id: 'LIST' },
          ]
          : [{ type: 'Class', id: 'LIST' }],
    }),

    getClassById: builder.query<ClassModel, string>({
      query: (id) => API_ENDPOINTS.CLASS.DETAILS(id),
      providesTags: (_result, _error, id) => [{ type: 'Class', id }],
    }),

    createClass: builder.mutation<ClassModel, Partial<ClassModel>>({
      query: (newClass) => ({
        ...API_ENDPOINTS.CLASS.CREATE(),
        body: newClass,
      }),
      invalidatesTags: [{ type: 'Class', id: 'LIST' }],
    }),

    updateClass: builder.mutation<ClassModel, { id: string; data: Partial<ClassModel> }>({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.CLASS.UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Class', id },
        { type: 'Class', id: 'LIST' },
      ],
    }),

    deleteClass: builder.mutation<void, string>({
      query: (id) => ({
        ...API_ENDPOINTS.CLASS.DELETE(id),
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Class', id },
        { type: 'Class', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClassesQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classApi;
