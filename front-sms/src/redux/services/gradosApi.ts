import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Grado, GradoList } from "../../../types/grado.type";


interface GradosResponse {
  message: string;
  data: GradoList[];
  error?: string;
}

interface GradoResponse {
  message: string;
  data: Grado;
  error?: string;
}

export const gradosApi = createApi({
  reducerPath: "gradosApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Grados"],
  endpoints: (builder) => ({
    getGrados: builder.query<GradosResponse, void>({
      query: () => "/api/grados",
      providesTags: [{ type: "Grados", id: "LIST" }],
    }),

    getGradoById: builder.query<GradoResponse, string>({
      query: (id) => `/api/grados/${id}`,
      providesTags: (result, error, id) => [{ type: "Grados", id }],
    }),

    createGrado: builder.mutation<GradoResponse, { nombre: string; ciclo_id: string | number }>({
      query: (data) => {
        console.log(" datos enviados a /grados", data);
        return {
          url: "/api/grados",
          method: "POST",
          body: {
            nombre: data.nombre,
            cicloEducativoId: Number(data.ciclo_id),
          },
        };
      },
      invalidatesTags: [{ type: "Grados", id: "LIST" }],
    }),

    updateGrado: builder.mutation<GradoResponse, { id: string; data: Partial<{ nombre: string; ciclo_id: string | number }> }>({
      query: ({ id, data }) => {
        const body: Record<string, unknown> = {};
        if (data.nombre) body.nombre = data.nombre;
        if (data.ciclo_id) body.cicloEducativoId = Number(data.ciclo_id);
        return {
          url: `/api/grados/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Grados", id },
        { type: "Grados", id: "LIST" },
      ],
    }),

    deleteGrado: builder.mutation<GradoResponse, string>({
      query: (id) => ({
        url: `/api/grados/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Grados", id: "LIST" }],
    }),
  }),
});

export const {
  useGetGradosQuery,
  useGetGradoByIdQuery,
  useCreateGradoMutation,
  useUpdateGradoMutation,
  useDeleteGradoMutation,
} = gradosApi;
