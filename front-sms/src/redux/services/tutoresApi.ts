import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Tutor, CreateTutorRequest } from "../../../types/tutor.type";

interface TutoresResponse {
  success: boolean;
  message: string;
  data: Tutor[];
}

interface TutorResponse {
  success: boolean;
  message: string;
  data: Tutor;
}

export const tutoresApi = createApi({
  reducerPath: "tutoresApi",
  tagTypes: ["Tutores"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Crear un tutor
    createTutor: builder.mutation<TutorResponse, CreateTutorRequest>({
      query: (tutor) => ({
        url: "/api/tutores",
        method: "POST",
        body: tutor,
      }),
      invalidatesTags: [{ type: "Tutores", id: "LIST" }],
    }),

    // Obtener tutores por alumno
    getTutoresByAlumno: builder.query<TutoresResponse, string | number>({
      query: (alumnoId) => `/api/tutores/alumno/${alumnoId}`,
      providesTags: (result, error, alumnoId) => [
        { type: "Tutores", id: `ALUMNO_${alumnoId}` },
        { type: "Tutores", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateTutorMutation,
  useGetTutoresByAlumnoQuery,
} = tutoresApi;
