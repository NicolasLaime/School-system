import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Seccion, SeccionList } from "../../../types/seccion.type";


interface SeccionesResponse {
  message: string;
  data: SeccionList[];
  error?: string;
}

interface SeccionResponse {
  message: string;
  data: Seccion;
  error?: string;
}

export const seccionesApi = createApi({
  reducerPath: "seccionesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Seccion"],
  endpoints: (builder) => ({
    getSecciones: builder.query<SeccionesResponse, void>({
      query: () => "/api/seccion",
      providesTags: [{ type: "Seccion", id: "LIST" }],
    }),

    getSeccionById: builder.query<SeccionResponse, string>({
      query: (id) => `/api/seccion/${id}`,
      providesTags: (result, error, id) => [{ type: "Seccion", id }],
    }),

    createSeccion: builder.mutation<SeccionResponse, { nombre: string; grado_id: string | number; ciclo_lectivo: string }>({
      query: (data) => {
        return {
          url: "/api/seccion",
          method: "POST",
          body: {
            nombre: data.nombre,
            gradoId: Number(data.grado_id),
            cicloLectivo: data.ciclo_lectivo,
          },
        };
      },
      invalidatesTags: [{ type: "Seccion", id: "LIST" }],
    }),

    updateSeccion: builder.mutation<SeccionResponse, { id: string; data: Partial<{ nombre: string; grado_id: string | number; ciclo_lectivo: string }> }>({
      query: ({ id, data }) => {
        const body: Record<string, unknown> = {};
        if (data.nombre) body.nombre = data.nombre;
        if (data.grado_id) body.gradoId = Number(data.grado_id);
        if (data.ciclo_lectivo) body.cicloLectivo = data.ciclo_lectivo;
        return {
          url: `/api/seccion/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Seccion", id },
        { type: "Seccion", id: "LIST" },
      ],
    }),

    deleteSeccion: builder.mutation<SeccionResponse, string>({
      query: (id) => ({
        url: `/api/seccion/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Seccion", id: "LIST" }],
    }),

    getSeccionesByGrado: builder.query<SeccionesResponse, string>({
      query: (gradoId) => `/api/seccion/grado/${gradoId}`,
      providesTags: (result, error, gradoId) => [{ type: "Seccion", id: `GRADO_${gradoId}` }],
    }),

    getSeccionesByCicloLectivo: builder.query<SeccionesResponse, string>({
      query: (cicloLectivo) => `/api/seccion/ciclo-lectivo/${cicloLectivo}`,
      providesTags: (result, error, cicloLectivo) => [{ type: "Seccion", id: `CICLO_${cicloLectivo}` }],
    }),
  }),
});

export const {
  useGetSeccionesQuery,
  useGetSeccionByIdQuery,
  useCreateSeccionMutation,
  useUpdateSeccionMutation,
  useDeleteSeccionMutation,
  useGetSeccionesByGradoQuery,
  useGetSeccionesByCicloLectivoQuery,
} = seccionesApi;
