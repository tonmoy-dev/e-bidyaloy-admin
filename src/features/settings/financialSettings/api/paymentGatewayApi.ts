import { API_ENDPOINTS } from '../../../../core/constants/api';
import { baseApi } from '../../../../core/services/baseApi';

// Define the model for a Payment Gateway Credential
export interface PaymentGatewayCredential {
  id: string;
  name: string;
  api_key: string;
  secret_key: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Optional: paginated response type if your API returns pagination
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const paymentGatewayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentGateways: builder.query<PaginatedResponse<PaymentGatewayCredential>, number | void>({
      query: (page = 1) => `${API_ENDPOINTS.PAYMENT_GATEWAY_CREDENTIALS.LIST().url}?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: 'PaymentGateway' as const,
                id,
              })),
              { type: 'PaymentGateway', id: 'LIST' },
            ]
          : [{ type: 'PaymentGateway', id: 'LIST' }],
    }),

    getPaymentGatewayById: builder.query<PaymentGatewayCredential, string>({
      query: (id) => `${API_ENDPOINTS.PAYMENT_GATEWAY_CREDENTIALS.DETAILS(id).url}`,
      providesTags: (_result, _error, id) => [{ type: 'PaymentGateway', id }],
    }),

    createPaymentGateway: builder.mutation<
      PaymentGatewayCredential,
      Partial<PaymentGatewayCredential>
    >({
      query: (newCredential) => ({
        url: API_ENDPOINTS.PAYMENT_GATEWAY_CREDENTIALS.CREATE().url,
        method: 'POST',
        body: newCredential,
      }),
      invalidatesTags: [{ type: 'PaymentGateway', id: 'LIST' }],
    }),

    updatePaymentGateway: builder.mutation<
      PaymentGatewayCredential,
      { id: string; data: Partial<PaymentGatewayCredential> }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.PAYMENT_GATEWAY_CREDENTIALS.PARTIAL_UPDATE(id).url,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'PaymentGateway', id },
        { type: 'PaymentGateway', id: 'LIST' },
      ],
    }),

    deletePaymentGateway: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.PAYMENT_GATEWAY_CREDENTIALS.DELETE(id).url,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'PaymentGateway', id },
        { type: 'PaymentGateway', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentGatewaysQuery,
  useGetPaymentGatewayByIdQuery,
  useCreatePaymentGatewayMutation,
  useUpdatePaymentGatewayMutation,
  useDeletePaymentGatewayMutation,
} = paymentGatewayApi;
