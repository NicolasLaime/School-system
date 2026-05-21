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
    createTutor: builder.mutation<TutorResponse, CreateTutorRequest>({
      query: (tutor) => ({
        url: "/api/tutores",
        method: "POST",
        body: tutor,
      }),
      invalidatesTags: [{ type: "Tutores", id: "LIST" }],
    }),

    getTutorById: builder.query<TutorResponse, number>({
      query: (id) => `/api/tutores/${id}`,
      providesTags: (result, error, id) => [
        { type: "Tutores", id: `TUTOR_${id}` },
      ],
    }),

    getTutoresByAlumno: builder.query<TutoresResponse, string>({
      query: (codigo) => `/api/tutores/alumno/${codigo}`,
      providesTags: (result, error, codigo) => [
        { type: "Tutores", id: `ALUMNO_${codigo}` },
        { type: "Tutores", id: "LIST" },
      ],
    }),

    updateTutor: builder.mutation<TutorResponse, { id: number; data: CreateTutorRequest }>({
      query: ({ id, data }) => ({
        url: `/api/tutores/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Tutores", id: `TUTOR_${id}` },
        { type: "Tutores", id: "LIST" },
      ],
    }),

    deleteTutor: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/tutores/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Tutores", id: `TUTOR_${id}` },
        { type: "Tutores", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateTutorMutation,
  useGetTutorByIdQuery,
  useGetTutoresByAlumnoQuery,
  useUpdateTutorMutation,
  useDeleteTutorMutation,
} = tutoresApi;
