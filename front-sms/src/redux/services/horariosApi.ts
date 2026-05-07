import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Horario } from "../../../types/horario.type";


interface HorariosResponse {
  message: string;
  data: Horario[];
  error?: string;
}

interface HorarioResponse {
  message: string;
  data: Horario;
  error?: string;
}

export const horariosApi = createApi({
  reducerPath: "horariosApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Horarios"],
  endpoints: (builder) => ({
    getHorarios: builder.query<HorariosResponse, void>({
      query: () => "/horarios",
      providesTags: [{ type: "Horarios", id: "LIST" }],
    }),

    getHorarioById: builder.query<HorarioResponse, string>({
      query: (id) => `/horarios/${id}`,
      providesTags: (result, error, id) => [{ type: "Horarios", id }],
    }),

    createHorario: builder.mutation<HorarioResponse, {
      diaSemana: string;
      horaInicio: string;
      horaFin: string;
      asignaturaId: number;
      seccionId: number;
    }>({

      query: (data) => {
        console.log("data", data);
        return {
          url: "/horarios",
          method: "POST",
          body: data,
        }
      },
      invalidatesTags: [{ type: "Horarios", id: "LIST" }],
    }),

    updateHorario: builder.mutation<HorarioResponse, {
      id: string;
      data: Partial<{
        diaSemana: string;
        horaInicio: string;
        horaFin: string;
        asignaturaId: number;
        seccionId: number;
      }>;
    }>({
      query: ({ id, data }) => ({
        url: `/horarios/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Horarios", id },
        { type: "Horarios", id: "LIST" },
      ],
    }),

    deleteHorario: builder.mutation<HorarioResponse, string>({
      query: (id) => ({
        url: `/horarios/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Horarios", id: "LIST" }],
    }),
  }),
});

export const {
  useGetHorariosQuery,
  useGetHorarioByIdQuery,
  useCreateHorarioMutation,
  useUpdateHorarioMutation,
  useDeleteHorarioMutation,
} = horariosApi;
