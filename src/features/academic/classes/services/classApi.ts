// src/features/api/endpoints/classEndpoints.ts

import { API_ENDPOINTS } from "../../../../core/constants/api";
import { baseApi } from "../../../../core/services/baseApi";
import type { ClassModel, PaginatedResponse } from "../models/model";


export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<PaginatedResponse<ClassModel>, number | void>({
      query: (page = 1) => `${API_ENDPOINTS.CLASS.LIST}?page=${page}`,
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({ type: 'Class' as const, id })),
            { type: 'Class', id: 'LIST' },
          ]
          : [{ type: 'Class', id: 'LIST' }],
    }),

    getClassById: builder.query<ClassModel, number>({
      query: (id) => `${API_ENDPOINTS.CLASS.DETAILS_BY_ID}${id}/`,
      providesTags: (result, error, id) => [{ type: 'Class', id }],
    }),

    createClass: builder.mutation<ClassModel, Partial<ClassModel>>({
      query: (newClass) => ({
        url: API_ENDPOINTS.CLASS.CREATE,
        method: 'POST',
        body: newClass,
      }),
      invalidatesTags: [{ type: 'Class', id: 'LIST' }],
    }),

    updateClass: builder.mutation<ClassModel, { id: number; data: Partial<ClassModel> }>({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.CLASS.UPDATE_BY_ID}${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Class', id },
        { type: 'Class', id: 'LIST' },
      ],
    }),

    deleteClass: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.CLASS.DELETE_BY_ID}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
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
