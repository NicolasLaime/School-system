import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Nota } from "../../../types/nota.type";

interface NotasResponse {
  message: string;
  data: Nota[];
  error?: string;
}

interface NotaResponse {
  message: string;
  data: {
    id: string;
    estudianteId: string;
    materiaId: string;
    bimestre: number;
    valor: number;
    docenteId: string;
    createdAt: string;
    updatedAt: string;
  };
  action: "created" | "updated";
  existingData?: {
    id: string;
    notaActual: number;
  };
}

interface createOrUpdateNota {
  estudianteId: string;
  materiaId: string;
  bimestre: number;
  valor: number;
  claseId?: string | null;
  docenteId: string;
}

export const notasApi = createApi({
  reducerPath: "notasApi", // ← Corregido el reducerPath
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    // Traer todas las notas
    getNotas: builder.query<NotasResponse, void>({
      query: () => "/api/notas",
    }),

    //traer notas por id
    getNotasbyId: builder.query<NotaResponse, string>({
      query: (id) => `/api/notas/${id}`,
    }),

    //crear Notas
    createNotas: builder.mutation<NotaResponse, Partial<Nota>>({
      query: (Notas) => {
        console.log("🛠️ Enviando notas desde mutation:", Notas);
        return {
          url: "/api/notas",
          method: "POST",
          body: Notas,
        };
      }
    }),

    // Actualizar Notas
    updateNotas: builder.mutation<NotaResponse, { id: string; data: Partial<Nota> }>({
      query: ({ id, data }) => {
        console.log("🛠️ Enviando Notas desde mutation:", data);
        return {
          url: `/api/notas/${id}`,
          method: "PUT",
          body: data,
        };
      },
    }),

    //agregar o editar nota
    createOrUpdateNota: builder.mutation<NotaResponse, createOrUpdateNota>({
      query: (body) => {
        console.log('📤 Datos enviados a /api/notas:', body);
        return {
          url: "/api/notas",
          method: "POST",
          body,
        };
      },
    }),

  }),
});

// Hooks auto-generados
export const {
  useGetNotasQuery,
  useCreateNotasMutation,
  useUpdateNotasMutation, 
  useGetNotasbyIdQuery,
  useCreateOrUpdateNotaMutation
} = notasApi;