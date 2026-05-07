import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Ciclo } from "../../../types/ciclo.type";


interface CiclosResponse {
  message: string;
  data: Ciclo[];
  error?: string;
}

interface CicloResponse {
  message: string;
  data: Ciclo;
  error?: string;
}

export const ciclosApi = createApi({
  reducerPath: "ciclosApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Ciclos"],
  endpoints: (builder) => ({
    getCiclos: builder.query<CiclosResponse, void>({
      query: () => "/ciclos",
      providesTags: [{ type: "Ciclos", id: "LIST" }],
    }),

    getCicloById: builder.query<CicloResponse, string>({
      query: (id) => `/ciclos/${id}`,
      providesTags: (result, error, id) => [{ type: "Ciclos", id }],
    }),

    createCiclo: builder.mutation<CicloResponse, { nombre: string }>({
      query: (data) => ({
        url: "/ciclos",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Ciclos", id: "LIST" }],
    }),

    updateCiclo: builder.mutation<CicloResponse, { id: string; data: Partial<Ciclo> }>({
      query: ({ id, data }) => ({
        url: `/ciclos/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Ciclos", id },
        { type: "Ciclos", id: "LIST" },
      ],
    }),

    deleteCiclo: builder.mutation<CicloResponse, string>({
      query: (id) => ({
        url: `/ciclos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Ciclos", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCiclosQuery,
  useGetCicloByIdQuery,
  useCreateCicloMutation,
  useUpdateCicloMutation,
  useDeleteCicloMutation,
} = ciclosApi;
