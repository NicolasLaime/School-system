import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { NotasResponse, NotaResponse, CreateNotaRequest, NotaResumenResponse } from "../../../types/nota.type";

interface createOrUpdateNota {
  estudianteId: string;
  materiaId: string;
  bimestre: number;
  valor: number;
  claseId?: string | null;
  docenteId: string;
}

export const notasApi = createApi({
  reducerPath: "notasApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Notas"],
  endpoints: (builder) => ({

    getNotas: builder.query<NotasResponse, void>({
      query: () => "/api/notas",
      providesTags: [{ type: "Notas", id: "LIST" }],
    }),

    getNotaById: builder.query<NotaResponse, string>({
      query: (id) => `/api/notas/${id}`,
      providesTags: (result, error, id) => [{ type: "Notas", id }],
    }),

    getNotasBySeccionAsignaturaBimestre: builder.query<NotasResponse, { seccionId: string | number; asignaturaId: string | number; bimestre: string | number }>({
      query: ({ seccionId, asignaturaId, bimestre }) =>
        `/api/notas/seccion/${seccionId}/asignatura/${asignaturaId}/bimestre/${bimestre}`,
      providesTags: [{ type: "Notas", id: "LIST" }],
    }),

    getResumenAlumno: builder.query<NotaResumenResponse, { alumnoId: string; cicloLectivo: string }>({
      query: ({ alumnoId, cicloLectivo }) =>
        `/api/notas/resumen/alumno/${alumnoId}?cicloLectivo=${encodeURIComponent(cicloLectivo)}`,
      providesTags: (result, error, { alumnoId }) => [{ type: "Notas", id: `RESUMEN_${alumnoId}` }],
    }),

    getNotasByAlumnoAsignatura: builder.query<NotasResponse, { alumnoId: string | number; asignaturaId: string | number; cicloLectivo: string }>({
      query: ({ alumnoId, asignaturaId, cicloLectivo }) =>
        `/api/notas/alumno/${alumnoId}/asignatura/${asignaturaId}?cicloLectivo=${encodeURIComponent(cicloLectivo)}`,
      providesTags: (result, error, { alumnoId }) => [{ type: "Notas", id: `ALUMNO_${alumnoId}` }],
    }),

    createNota: builder.mutation<NotaResponse, CreateNotaRequest>({
      query: (body) => ({
        url: "/api/notas",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Notas", id: "LIST" }],
    }),

    createOrUpdateNota: builder.mutation<NotaResponse, createOrUpdateNota>({
      query: (body) => ({
        url: "/api/notas",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Notas", id: "LIST" }],
    }),

    updateNota: builder.mutation<NotaResponse, { id: string; data: Partial<CreateNotaRequest> }>({
      query: ({ id, data }) => ({
        url: `/api/notas/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Notas", id },
        { type: "Notas", id: "LIST" },
      ],
    }),

    deleteNota: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/notas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Notas", id: "LIST" }],
    }),

    uploadNotasExcel: builder.mutation<NotaResponse, { seccionId: number; asignaturaId: number; cicloLectivo: string; docenteId: number; archivo: File }>({
      query: ({ archivo, ...params }) => {
        const formData = new FormData();
        formData.append("archivo", archivo);
        return {
          url: `/api/notas/excel?seccionId=${params.seccionId}&asignaturaId=${params.asignaturaId}&cicloLectivo=${encodeURIComponent(params.cicloLectivo)}&docenteId=${params.docenteId}`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: [{ type: "Notas", id: "LIST" }],
    }),


    //nota alumno asignatura

    getNotaAlumnoAsignatura: builder.query<NotaResponse, { alumnoId: number; asignaturaId: number, cicloLectivo: string }>({ query: ({ alumnoId, asignaturaId, cicloLectivo }) => `/api/notas/alumno/${alumnoId}/asignatura/${asignaturaId}?cicloLectivo=${encodeURIComponent(cicloLectivo)}`, providesTags: (result, error, { alumnoId }) => [{ type: "Notas", id: `ALUMNO_${alumnoId}` }] }),

  }),
});

export const {
  useGetNotasQuery,
  useGetNotaByIdQuery,
  useGetNotasBySeccionAsignaturaBimestreQuery,
  useGetResumenAlumnoQuery,
  useGetNotasByAlumnoAsignaturaQuery,
  useLazyGetNotasByAlumnoAsignaturaQuery,
  useCreateNotaMutation,
  useCreateOrUpdateNotaMutation,
  useUpdateNotaMutation,
  useDeleteNotaMutation,
  useUploadNotasExcelMutation,
} = notasApi;
