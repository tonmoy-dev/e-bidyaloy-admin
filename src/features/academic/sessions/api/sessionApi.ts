// src/features/api/endpoints/sessionEndpoints.ts

import { API_ENDPOINTS } from "../../../../core/constants/api";
import { baseApi } from "../../../../core/services/baseApi";
import type { PaginatedResponse, SessionModel } from "../models/session.model";


export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<PaginatedResponse<SessionModel>, number | void>({
      query: (page = 1) => API_ENDPOINTS.SESSION.LIST({ page }),
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ id }) => ({ type: 'Session' as const, id })),
            { type: 'Session', id: 'LIST' },
          ]
          : [{ type: 'Session', id: 'LIST' }],
    }),

    getSessionById: builder.query<SessionModel, number>({
      query: (id) => API_ENDPOINTS.SESSION.DETAILS(id),
      providesTags: (_result, _error, id) => [{ type: 'Session', id }],
    }),

    createSession: builder.mutation<SessionModel, Partial<SessionModel>>({
      query: (newSession) => ({
        ...API_ENDPOINTS.SESSION.CREATE(),
        body: newSession,
      }),
      invalidatesTags: [{ type: 'Session', id: 'LIST' }],
    }),

    updateSession: builder.mutation<SessionModel, { id: number; data: Partial<SessionModel> }>({
      query: ({ id, data }) => ({
        ...API_ENDPOINTS.SESSION.UPDATE(id),
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Session', id },
        { type: 'Session', id: 'LIST' },
      ],
    }),

    deleteSession: builder.mutation<void, number>({
      query: (id) => API_ENDPOINTS.SESSION.DELETE(id),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Session', id },
        { type: 'Session', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSessionsQuery,
  useGetSessionByIdQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} = sessionApi;
