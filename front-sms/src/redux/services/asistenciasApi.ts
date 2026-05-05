import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { AsistenciaDocente, AsistenciaAlumno, CreateAsistenciaDocenteDto, CreateAsistenciaAlumnoDto } from "../../../types/asistencia.type";

interface AsistenciasDocenteResponse {
  message: string;
  data: AsistenciaDocente[];
  error?: string;
}

interface AsistenciasAlumnoResponse {
  message: string;
  data: AsistenciaAlumno[];
  error?: string;
}

interface AsistenciaResponse {
  message: string;
  data: AsistenciaDocente | AsistenciaAlumno;
  error?: string;
}

export const asistenciasApi = createApi({
  reducerPath: "asistenciasApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Asistencias"],
  endpoints: (builder) => ({
    getAsistenciasDocente: builder.query<AsistenciasDocenteResponse, { fecha: string }>({
      query: ({ fecha }) => ({
        url: "/asistencias/docente",
        method: "GET",
        params: { fecha },
      }),
      providesTags: [{ type: "Asistencias", id: "DOCENTE_LIST" }],
    }),

    createAsistenciaDocente: builder.mutation<AsistenciaResponse, CreateAsistenciaDocenteDto>({
      query: (data) => ({
        url: "/asistencias/docente",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Asistencias", id: "DOCENTE_LIST" }],
    }),

    createAsistenciaAlumno: builder.mutation<AsistenciaResponse, CreateAsistenciaAlumnoDto>({
      query: (data) => {
        console.log("data asistencia alumno: ", data);
        return {
          url: "/asistencias/alumno",
          method: "POST",
          body: data,
        }
      },
      invalidatesTags: [{ type: "Asistencias", id: "ALUMNO_LIST" }],
    }),

    getAsistenciasAlumnoBySeccion: builder.query<AsistenciasAlumnoResponse, { seccionId: number | string; fecha: string }>({
      query: ({ seccionId, fecha }) => ({
        url: `/asistencias/alumno/seccion/${seccionId}`,
        method: "GET",
        params: { fecha },
      }),
      providesTags: [{ type: "Asistencias", id: "ALUMNO_LIST" }],
    }),
  }),
});

export const {
  useGetAsistenciasDocenteQuery,
  useCreateAsistenciaDocenteMutation,
  useCreateAsistenciaAlumnoMutation,
  useGetAsistenciasAlumnoBySeccionQuery,
} = asistenciasApi;
