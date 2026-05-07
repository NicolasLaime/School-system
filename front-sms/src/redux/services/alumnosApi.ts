import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Alumno, AlumnoList } from "../../../types/alumnos.types";
import { Clase } from "../../../types/Usuario.type";



interface alumnosResponse {
  message: string;
  data: AlumnoList[];
  error?: string;
}

interface AlumnoResponse {
  message: string;
  data: AlumnoList;
  error?: string;
  success?: boolean;
  enrollment?: {
    totalClases: number;
    inscripcionesCreadas: number;
  };
}

export const alumnosApi = createApi({
  reducerPath: "alumnosApi = createApi({",
  tagTypes: ['Alumnos'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    // Traer todas las materias
    getAlumnos: builder.query<alumnosResponse, void>({
      query: () => "/api/alumnos",
      providesTags: [{ type: 'Alumnos', id: 'LIST' }],
    }),

    //traer alumno por id
    getAlumnobyId: builder.query<AlumnoResponse, string>({
      query: (id) => `/api/alumnos/${id}`,
      providesTags: ['Alumnos'],
    }),

    //crear alumno
    createAlumno: builder.mutation<AlumnoResponse, Partial<Alumno>>({
      query: (alumno) => {
        console.log("🛠️ Enviando alumno desde mutation:", alumno);
        return {
          url: "/api/alumnos",
          method: "POST",
          body: alumno,
        };
      }
    }),

    // Actualizar alumno
    updateAlumno: builder.mutation<AlumnoResponse, { id: number; data: Partial<Alumno> }>({
      query: ({ id, data }) => {
        console.log("🛠️ Enviando alumno desde mutation:", data);
        return {
          url: `/api/alumnos/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ['Alumnos'],
    }),

    //traer notas por año
    getNotasPorAnio: builder.query<{
      message: string;
      data: {
        anioLectivo: number;
        notasPorMateria: Clase[];
        totalNotas: number;
      };
    }, { id: string; anio: number }>({
      query: ({ id, anio }) => `/api/alumnos/${id}/notas/${anio}`,
      providesTags: ['Alumnos'],
    }),

    // Eliminar alumno
    deleteAlumno: builder.mutation<{
      message: string;
      data: Alumno;
      success: boolean;
    }, string>({
      query: (id) => ({
        url: `/api/alumnos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Alumnos'],
    }),

    //alumno por seccion
    getAlumnosPorSeccion: builder.query<alumnosResponse, string>({
  query: (seccionId) => `/api/alumnos/seccion/${seccionId}`,
  providesTags: ['Alumnos'],
}),

    //alumno por grado y ciclo lectivo
    getAlumnosPorGradoYCiclo: builder.query<alumnosResponse, { gradoId: string; cicloLectivo: string }>({
      query: ({ gradoId, cicloLectivo }) => `/api/alumnos/grado/${gradoId}/ciclo/${cicloLectivo}`,
      providesTags: ['Alumnos'],
    }),

    //alumno por codigo
    getAlumnosPorCodigo: builder.query<alumnosResponse, string>({
      query: (codigo) => `/api/alumnos/codigo/${codigo}`,
      providesTags: ['Alumnos'],
    }),
  }),
});

// Hooks auto-generados
export const {
  useGetAlumnosQuery,
  useCreateAlumnoMutation,
  useUpdateAlumnoMutation,
  useGetAlumnobyIdQuery,
  useGetNotasPorAnioQuery,
  useDeleteAlumnoMutation,
  useGetAlumnosPorSeccionQuery,
  useGetAlumnosPorGradoYCicloQuery,
  useGetAlumnosPorCodigoQuery,
} = alumnosApi






