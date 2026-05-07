import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Ponderacion, CreatePonderacionDto, UpdatePonderacionDto, PonderacionResumen } from "../../../types/ponderacion.type";

interface PonderacionesResponse {
  message: string;
  data: Ponderacion[];
  error?: string;
}

interface PonderacionResponse {
  message: string;
  data: Ponderacion;
  error?: string;
}

interface PonderacionResumenResponse {
  message: string;
  data: PonderacionResumen;
  error?: string;
}

export const ponderacionesApi = createApi({
  reducerPath: "ponderacionesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Ponderaciones"],
  endpoints: (builder) => ({
    getPonderaciones: builder.query<PonderacionesResponse, void>({
      query: () => "/api/ponderaciones",
      providesTags: [{ type: "Ponderaciones", id: "LIST" }],
    }),

    getPonderacionById: builder.query<PonderacionResponse, string>({
      query: (id) => `/api/ponderaciones/${id}`,
      providesTags: (result, error, id) => [{ type: "Ponderaciones", id }],
    }),

    createPonderacion: builder.mutation<PonderacionResponse, CreatePonderacionDto>({
      query: (data) => ({
        url: "/api/ponderaciones",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Ponderaciones", id: "LIST" }],
    }),

    updatePonderacion: builder.mutation<PonderacionResponse, { id: string; data: UpdatePonderacionDto }>({
      query: ({ id, data }) => ({
        url: `/api/ponderaciones/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Ponderaciones", id },
        { type: "Ponderaciones", id: "LIST" },
      ],
    }),

    deletePonderacion: builder.mutation<PonderacionResponse, string>({
      query: (id) => ({
        url: `/api/ponderaciones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Ponderaciones", id: "LIST" }],
    }),

    getPonderacionesByCiclo: builder.query<PonderacionesResponse, string>({
      query: (cicloId) => `/api/ponderaciones/ciclo/${cicloId}`,
      providesTags: [{ type: "Ponderaciones", id: "CICLO" }],
    }),

    getPonderacionesResumenByCiclo: builder.query<PonderacionResumenResponse, string>({
      query: (cicloId) => `/api/ponderaciones/ciclo/${cicloId}/resumen`,
      providesTags: [{ type: "Ponderaciones", id: "RESUMEN" }],
    }),
  }),
});

export const {
  useGetPonderacionesQuery,
  useGetPonderacionByIdQuery,
  useCreatePonderacionMutation,
  useUpdatePonderacionMutation,
  useDeletePonderacionMutation,
  useGetPonderacionesByCicloQuery,
  useGetPonderacionesResumenByCicloQuery,
} = ponderacionesApi;
