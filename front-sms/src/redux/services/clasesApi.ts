import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Clase } from "../../../types/Usuario.type";


interface ClasesResponse {
  message: string;
  data: Clase[];
  error?: string;
}

interface ClaseResponse {
  message: string;
  data: Clase;
  error?: string;
}

export const clasesApi = createApi({
  reducerPath: "clasesApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Traer todas las clases
    getClases: builder.query<ClasesResponse, void>({
      query: () => "/clases",
    }),

    // Traer clases por id
    getClasesbyId: builder.query<ClaseResponse, string>({
      query: (id) => `/clases/${id}`,
    }),

    // Traer clases por docente
    getClasesByDocente: builder.query<ClasesResponse, string>({
      query: (docenteId) => `/clases/docente/${docenteId}`,
    }),

    // Traer clases por materia
    getClasesByMateria: builder.query<Clase[], string>({
      query: (materiaId) => `/clases/materia/${materiaId}`,
    }),

    // Traer clases por alumno
    getClasesByAlumno: builder.query<Clase[], string>({
      query: (alumnoId) => `/clases/alumno/${alumnoId}`,
    }),

    //crear nueva clase
    createClase: builder.mutation<Clase, Partial<Clase>>({
      query: (clase) => {
        console.log("🛠️ Enviando clase desde mutation:", clase);
        return {
          url: "clases",
          method: "POST",
          body: clase,
        };
      }
    }),

    //actualizar clase
    updateClase: builder.mutation<Clase, { id: string; data: Partial<Clase> }>({
      query: ({id , data}) => {
        console.log("🛠️ Enviando Clase desde mutation:", data);
        return {
          url: `/clases/${id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
  }),
});

// Hooks auto-generados
export const {
  useGetClasesQuery,
  useGetClasesByDocenteQuery,
  useGetClasesByMateriaQuery,
  useGetClasesByAlumnoQuery,
  useGetClasesbyIdQuery,
  useCreateClaseMutation,
  useUpdateClaseMutation,
} = clasesApi;






